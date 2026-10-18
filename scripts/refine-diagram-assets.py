#!/usr/bin/env python3
"""Refine original diagram pixels, never redraw or generate diagram geometry.

Render source PDF crops at 1800px, normalize paper illumination, sharpen the
existing linework, mask only reviewed caption areas, and convert paper white to
alpha. Crops keep their source coordinates unless an explicit reviewed photo rectification is configured; no side padding is added.
"""
import argparse, hashlib, json
from pathlib import Path
import fitz
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps
from scipy.ndimage import gaussian_filter, maximum_filter, map_coordinates

ROOT=Path(__file__).resolve().parents[1]
KEEP_LAKE={(263,264,334,275),(247,465,369,479)}
UPLOAD_FILE=ROOT/'import/diagram-upload-overrides.json'
UPLOADS=json.loads(UPLOAD_FILE.read_text()) if UPLOAD_FILE.exists() else {}

def refine_uploaded(job,c):
    source=ROOT/c['sourceAsset']
    assert hashlib.sha256(source.read_bytes()).hexdigest()==c['sourceSHA256'],(job,'uploaded source hash changed')
    gray=Image.open(source).convert('L')
    assert list(gray.size)==c['nativeSize']
    if c.get('paperNormalization')=='local-paper':
        # Estimate photographed paper before whitening caption masks; otherwise
        # the artificial white mask rectangles leak into the paper estimate.
        raw=np.asarray(gray,dtype=np.float32)
        paper=gaussian_filter(maximum_filter(raw,size=401),sigma=30)
        gray=Image.fromarray(np.clip(raw*255/np.maximum(paper,1),0,255).astype('uint8'))
    original=gray.copy();draw=ImageDraw.Draw(gray)
    for rect in c['masks']:draw.rectangle(rect,fill=255)
    if c.get('protectLines'):
        protect=Image.new('L',gray.size,0);pd=ImageDraw.Draw(protect)
        for line in c['protectLines']:pd.line([tuple(v) for v in line],fill=255,width=10)
        gray.paste(original,(0,0),protect)
    # Keep the uploaded pixels at native resolution. Only near-white paper is
    # made transparent; do not upscale, redraw, sharpen or change arrow geometry.
    gray=gray.crop(c['crop']);a=np.asarray(gray,dtype=np.float32)
    if c.get('paperNormalization')=='local-paper':clean=a
    else:
        paper=np.maximum(np.percentile(a,99,axis=1)[:,None],np.percentile(a,99,axis=0)[None,:])
        clean=np.clip(a*255/np.maximum(paper,1),0,255)
    cutoff=c.get('paperCutoff',12)
    alpha=np.clip((255-clean-cutoff)*255/(255-cutoff),0,255).astype('uint8');alpha[alpha<8]=0
    out=Image.new('RGBA',gray.size,(0,0,0,0));out.putalpha(Image.fromarray(alpha))
    path=ROOT/'dist/assets'/('diagram-'+job+'-uploaded-v1.png');out.save(path,optimize=True)
    return {'job':job,'asset':str(path.relative_to(ROOT/'dist')),'sourceId':c['sourceId'],'sourceSHA256':c['sourceSHA256'],'sourcePage':None,'sourceCrop':c['crop'],'sourceCoordinateSpace':'native image pixels','width':out.width,'height':out.height,'padding':0,'masksApplied':len(c['masks']),'paperTransparent':True,'transparentPixels':int(np.count_nonzero(alpha==0)),'opaquePixels':int(np.count_nonzero(alpha==255)),'alphaRange':[int(alpha.min()),int(alpha.max())],'imageSHA256':hashlib.sha256(path.read_bytes()).hexdigest(),'method':'User-supplied high-resolution image; native resolution retained; reviewed caption masks and near-white paper removal only. No redrawing, warping or sharpening.','retainedRasterCaptions':c['retainedRasterCaptions'],'rectification':None,'artworkVersion':'uploaded-raster-v1','paperNormalization':c.get('paperNormalization'),'paperCutoff':cutoff,'limitation':'Uses the supplied image as-is; no independent reconstruction of its content.'}

def refine(job,c,cache):
    if job in UPLOADS:return refine_uploaded(job,UPLOADS[job])
    source=cache/(c['source']+'.pdf')
    with fitz.open(source) as doc:
        page=doc[c['page']-1]; crop=fitz.Rect(c['crop']); scale=1800/crop.width
        pix=page.get_pixmap(matrix=fitz.Matrix(scale,scale),clip=crop,colorspace=fitz.csGRAY,alpha=False)
        gray=Image.frombytes('L',(pix.width,pix.height),pix.samples)
        # Estimate paper illumination without treating object fills as paper.
        a=np.asarray(gray,dtype=np.float32)
        # Use paper references from the row/column edges of the intensity
        # distribution, not a small sliding maximum: that turns broad dark
        # objects (notably the coaster motor) into artificial white patches.
        paper_rows=np.percentile(a,99,axis=1)[:,None]
        paper_cols=np.percentile(a,99,axis=0)[None,:]
        background=gaussian_filter(np.maximum(paper_rows,paper_cols),sigma=18)
        clean=np.clip(a*255/np.maximum(background,1),0,255)
        clean=np.clip((clean-15)*255/(245-15),0,255).astype('uint8')
        gray=Image.fromarray(clean).filter(ImageFilter.UnsharpMask(radius=1.15,percent=135,threshold=3))
        masks=[r for r in c.get('masks',[]) if not(job.startswith('p2-lake-bosumtwi') and tuple(r) in KEEP_LAKE)]
        original_ink=gray.copy()
        if job=='p1-the-origins-of-cinema':
            # Source text touches both top leader arrows. Tight line masks keep
            # the original slanted and vertical leader pixels intact.
            masks=[[60,216,117,234],[121,215,156,235],
                   [60,234,134,253],[60,257,132,270],
                   [329,262,536,280],[254,539,555,557]]
        draw=ImageDraw.Draw(gray)
        for r in masks:
            draw.rectangle([(r[0]-crop.x0)*scale,(r[1]-crop.y0)*scale,(r[2]-crop.x0)*scale,(r[3]-crop.y0)*scale],fill=255)
        if job=='p1-the-origins-of-cinema':
            protect=Image.new('L',gray.size,0);pd=ImageDraw.Draw(protect)
            coords=[(114,225),(118,225),(151,278),(146,280)]
            pd.polygon([((x-crop.x0)*scale,(y-crop.y0)*scale) for x,y in coords],fill=255)
            coords=[(470,275),(470,279),(400,302),(399,299)]
            pd.polygon([((x-crop.x0)*scale,(y-crop.y0)*scale) for x,y in coords],fill=255)
            gray.paste(original_ink,(0,0),protect)
        if c.get('pixelArrowProtection'):
            protect=Image.new('L',gray.size,0);pd=ImageDraw.Draw(protect)
            rw,rh=c['rectification']['referenceSize']
            for line in c['pixelArrowProtection']:
                pts=[(x/rw*gray.width,y/rh*gray.height) for x,y in line]
                pd.line(pts,fill=255,width=max(1,round(4*gray.width/rw)))
            gray.paste(original_ink,(0,0),protect)
        if c.get('rectification'):
            # Correct photographed panel tilt by resampling the original ink.
            # Both arrows and objects travel through the same smooth map.
            r=c['rectification'];reference=np.asarray(r['referenceSize'],dtype=float)
            # The source panel border touches its title. Restore only the
            # original border pixels removed by the reviewed text masks.
            protect=Image.new('L',gray.size,0);pd=ImageDraw.Draw(protect)
            for corners in (r['source'][:4],r['source'][4:8]):
                pts=[(x/reference[0]*gray.width,y/reference[1]*gray.height) for x,y in corners]
                pd.line(pts+[pts[0]],fill=255,width=max(1,round(2*gray.width/reference[0])))
            gray.paste(original_ink,(0,0),protect)
            src=np.asarray(r['source'],dtype=float)/reference
            dst=np.asarray(r['target'],dtype=float)/reference
            # One projective transform keeps straight leaders straight; unlike
            # a spline it cannot bend a shaft between control points.
            rows=[]
            for (x,y),(u,v) in zip(src[:8],dst[:8]):
                rows.extend([[-x,-y,-1,0,0,0,u*x,u*y,u],[0,0,0,-x,-y,-1,v*x,v*y,v]])
            _,_,vh=np.linalg.svd(np.asarray(rows));H=vh[-1].reshape(3,3)
            H[0]+=r.get('horizontalOffset',0)*H[2]
            inverse=np.linalg.inv(H)
            yy,xx=np.mgrid[0:gray.height,0:gray.width]
            q=np.vstack((xx.ravel()/(gray.width-1),yy.ravel()/(gray.height-1),np.ones(xx.size)))
            mapped=inverse@q;mapped=mapped[:2]/mapped[2]
            coords=np.vstack((mapped[1]*(gray.height-1),mapped[0]*(gray.width-1)))
            sampled=map_coordinates(np.asarray(gray,dtype=float),coords,order=1,mode='constant',cval=255)
            gray=Image.fromarray(np.clip(sampled.reshape(gray.height,gray.width),0,255).astype('uint8'))
        # Black ink plus continuous alpha retains grey shaded details, removes
        # the paper entirely, and does not create white rectangles at labels.
        alpha=255-np.asarray(gray)
        if job=='p1-the-olympic-torch-chua-rep' and not c.get('rectification'):
            # The source includes photographed grey paper stains. A soft ink
            # threshold removes these while retaining the dark original torches.
            alpha=np.clip((alpha.astype(np.float32)-38)*255/217,0,255).astype('uint8')
        alpha[alpha<9]=0
        out=Image.new('RGBA',gray.size,(0,0,0,0));out.putalpha(Image.fromarray(alpha))
        path=ROOT/'dist/assets'/('diagram-'+job+'-source-v2.png');out.save(path,optimize=True)
        return {'job':job,'asset':str(path.relative_to(ROOT/'dist')),'sourceId':c['source'],'sourceSHA256':hashlib.sha256(source.read_bytes()).hexdigest(),'sourcePage':c['page'],'sourceCrop':c['crop'],'width':out.width,'height':out.height,'padding':0,'masksApplied':len(masks),'paperTransparent':True,'transparentPixels':int(np.count_nonzero(alpha==0)),'opaquePixels':int(np.count_nonzero(alpha==255)),'alphaRange':[int(alpha.min()),int(alpha.max())],'imageSHA256':hashlib.sha256(path.read_bytes()).hexdigest(),'method':'Source raster rendering; row/column paper-reference normalization; tonal contrast; unsharp mask; reviewed caption masks; grayscale ink alpha. Original arrows and linework retained; no generated details.','retainedRasterCaptions':['R/V KALINDI','CENTRAL UPLIFT'] if job.startswith('p2-lake-bosumtwi') else c.get('retainedRasterCaptions',[]),'rectification':c.get('rectification'), 'limitation':'Sharpening improves contrast; low-resolution original raster details cannot be reconstructed reliably.'}

def main():
    p=argparse.ArgumentParser();p.add_argument('--cache',type=Path,required=True);p.add_argument('--contact-sheet',type=Path);args=p.parse_args()
    layouts=json.loads((ROOT/'import/diagram-layouts.json').read_text());rows=[refine(j,c,args.cache) for j,c in layouts.items()]
    (ROOT/'import/diagram-refinement-audit.json').write_text(json.dumps({'version':2,'count':len(rows),'diagrams':rows},indent=2)+'\n')
    if args.contact_sheet:
        w,h=650,470; sheet=Image.new('RGB',(w*4,h*4),'#f1f1ee');d=ImageDraw.Draw(sheet)
        for i,r in enumerate(rows):
            im=Image.open(ROOT/'dist'/r['asset']);im.thumbnail((w-24,h-65))
            x=(i%4)*w;y=(i//4)*h
            sheet.paste(im,(x+(w-im.width)//2,y+54),im)
            d.text((x+12,y+9),r['job'][:48],fill='black');d.text((x+12,y+28),f"{r['width']} x {r['height']}; transparent paper",fill='black')
        sheet.save(args.contact_sheet)
    print(f'Refined {len(rows)} diagrams without padding; all PNGs RGBA.')
if __name__=='__main__':main()
