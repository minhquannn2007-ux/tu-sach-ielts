"""Build explicit, measured diagram canvases; source linework never moves independently.
Caption lines are intentional, not browser-dependent word wrapping. Only these
sixteen source-reviewed diagrams are handled; new sources still require review.
"""
import argparse,json,re,math
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1]
FONT=ImageFont.truetype('/usr/share/fonts/opentype/urw-base35/NimbusSans-Regular.otf',16)
TITLE_FONT=ImageFont.truetype('/usr/share/fonts/opentype/urw-base35/NimbusSans-Bold.otf',18)
LINE=30;GAP=180
p=argparse.ArgumentParser();p.add_argument('--lessons',type=Path,default=ROOT/'dist/lessons');p.add_argument('--qa',type=Path);a=p.parse_args()
configs=json.load(open(ROOT/'import/diagram-layouts.json'))
upload_file=ROOT/'import/diagram-upload-overrides.json'
uploads=json.load(open(upload_file)) if upload_file.exists() else {}
configs.update(uploads)
raster_audit=ROOT/'import/diagram-refinement-audit.json'
rasters={r['job']:r for r in json.load(open(raster_audit))['diagrams']} if raster_audit.exists() else {}
def label(text,x,y,anchor='start',dx=0,dy=0):return dict(text=text,sx=x,sy=y,anchor=anchor,dx=dx,dy=dy)
L=label
spec={
'p1-a-watchful-eye-on-bridges':[L('{{5}}',478,312,dy=-15),L('{{6}}',498,242,dy=-15),L('{{7}}',118,309,'end',-12,-15),L('{{8}}',420,150,dy=-15)],
'p1-ancient-greek-coins':[L('Piece of metal known as\n{{8}}',184,334,'end',-12,-45),L('Obverse die',188,413,'end',-10,-15),L('{{7}}',464,321,dy=-15),L('{{9}}',464,426,dy=-15),L('{{10}}',218,466,'end',-12,-15)],
'p1-barrels':[L('{{4}}',1426,1470,dy=-15),L('metal {{5}}',1410,1866,dy=-15),L('curved {{6}}',447,1989,'end',-12,-15)],
'p1-practical-action':[L('Metal trailer with two wheels',303,187),L('Tyres made of {{9}}',303,234),L('Seat for a {{10}}',303,288),L('Bed with {{11}} for comfort',304,314),L('{{12}} to link up to bicycle',305,353),L('Special {{13}} attached when raining',305,394)],
'p1-the-history-of-cakes-at-wedding':[L('Examples of wedding cakes with several {{10}}',74,168),L('In the early 1900s {{11}} were used\nto keep individual cakes apart.',331,310),L('The size of these cakes as well as\ntheir {{12}} affects pricing.',305,370),L('Hardened {{13}} between cakes\nstopped higher cakes sinking into lower\ncakes.',56,399)],
'p1-the-olympic-torch-chua-rep':[L('Burner with a double\nflame to withstand\nwindy conditions',290.0,196.66666666666666,'start',0,0),L('A {{10}}',161.66666666666669,216.66666666666666,'end',-12,-15),L('Fuel in the form of a\n{{11}}',290.0,243.33333333333331,'start',0,0),L('Brass valve with many\nsmall {{12}}',290.0,276.6666666666667,'start',-20,10),L('Combination of\n{{13}}\nand\n{{13:1}}\nstored as liquid',290.0,323.33333333333337,'start',0,0),L('Propylene stored as\nliquid fuel',176.66666666666669,332.0,'end',-12,-15)],
'p1-the-origins-of-cinema':[L('{{1}} which\nis turned by\na {{2}}',110,216,'end',-12),L('series of pictures on a {{3}} strip',329,262,dy=-42),L('{{4}} through which ‘moving’ images were viewed',254,539,dy=12)],
'p1-the-treadle-pump':[L('Operator able to work for\n{{7}} before stopping',525,1508,'end',-12),L('Support structures\nmade of {{8}}',1281,1508),L('Pump has {{9}}\nand pistons that are\nlinked together',1281,1708,dx=22,dy=30),L('Water is pumped from\nas far down as {{10}}',1280,1948,dx=22),L('Treadles are moved up and\ndown by stepping motion',510,1943,'end',-12)],
'p1-the-tyne-bridge':[L('top of arch, {{11}} metres above high-water level',288,197),L('arch made of steel',152,212,'end',-10),L('Main arch',356,257),L('Pier',168.5,272,'center'),L('Pier',419.5,272,'center'),L('High water level',290.5,329,'center'),L('Newcastle Quay',166,348,'center'),L('Gateshead Quay',423.5,347,'center'),L('Each pier was originally designed to be\nused as a {{12}}.',174,438),L('One end of the arch to the other measures\n{{13}} metres.',174,481)],
'p1-tikopia':[L('{{5}}\nis collected from here',233,518,'end',-12),L('bowl made from a\n{{7}}',235,564,'end',-12),L('hard {{6}} of sap',421,544),L('lengths of bark taken from fau tree',398,624),L('blade made from katoko’s\n{{8}}',396,660),L('made from the {{9}}\nof a small tree',92,699),L('Chisel',350,600,'center')],
'p2-lake-bosumtwi-the-secrets-of-a-crater-lake':[L('{{20}}\ncreated by pneumatic\nexplosions',91,345,'end',-12),L('{{19}}',505,217,dy=-15),L('{{21}}',505,415,dy=-15)],
'p2-roller-coaster-the-great-fairground-attraction':[L('lift hill',101,197,'end',-10),L('tracks',252,178,'center'),L('START',86,300,'end',-10),L('lifting mechanism',140,521,'center'),L('{{14}}',391,393,dy=-15),L('{{15}}',385,474,dy=-15),L('{{16}}',135,437.5,'end',-12,-15)],
'p3-movement-underwater':[L('streamlined shape narrowing towards rear to reduce\n{{36}} drag',219,232),L('ideal tail fin shape\nfor steady movement\nknown as cruising',466,278),L('slime-covered scales\nto minimise surface\nfriction',468,385),L('fins controlling\n{{38}} movement',83,405),L('fin controlling {{37}}\nmovement',242,400),L('fins which are important for\n{{39}} of fish',108,454),L('Minimal cross-sectional body area:\nto decrease {{40}} drag',312,582)],
'p3-patterns-of-nature':[L('Three-lane system as\nused by {{34}}',165,213),L('Group members going\ntowards front of swarm',375,222),L('Group members going back\nto the {{35}}',382,481),L('Formation in shape called a\n{{36}}; has central {{37}}\naround which group members\ncirculate.',387,520)],
'p3-termite-mounds':[L('Top of the mound permits\n{{37}}',181,163,'end',-10),L('Innermost chamber\ncontaining termites’ nest',181,225,'end',-10),L('Cellar to aid control of\n{{36}}\nlevels in mound',187,299,'end',-10),L('Network of\n{{34}}\nhelps to give the termites\na constant {{35}}\nsupply and to maintain a\nlimited temperature range',376,192)],
'p3-the-secret-sounds-of-elephants':[L('Large {{27}}\nin inner ear',155,704),L('Inner ear with similar\ncochlear structure to that\nof reptiles',1227,704),L('Extensive network of\n{{30}}\nin front of skull',153,882),L('Extremely large\n{{28}}',1380,1188),L('A {{29}} beneath toe bones',752,1704)]}
spec.update({job:c['labels'] for job,c in uploads.items()})
def linewidth(s,font=FONT):
 parts=re.split(r'(\{\{\d+(?::\d+)?\}\})',s)
 return sum(GAP if p.startswith('{{') else font.getlength(p) for p in parts)
def build(job,g):
 c=configs[job];x0,y0,x1,y1=c['crop'];imageW=float(c.get('displayArtWidth',800));scale=imageW/(x1-x0);imageH=(y1-y0)*scale
 items=[]
 for s in spec[job]:
  font=TITLE_FONT if s.get('title') else FONT
  lines=s['text'].split('\n');w=math.ceil(max(linewidth(l,font) for l in lines))+4;h=len(lines)*LINE
  x=(s['sx']-x0)*scale+s['dx'];y=(s['sy']-y0)*scale+s['dy']
  if s['anchor']=='end':x-=w
  if s['anchor']=='center':x-=w/2
  items.append({**s,'px':x,'py':y,'pw':w,'ph':h})
 # Expand the canvas only where labels actually require room, not a global
 # percentage pad or the unrelated legacy Perfume/Jenny aspect ratio.
 padX=max(0,-min(s['px'] for s in items))+12;padY=max(0,-min(s['py'] for s in items))+8
 width=math.ceil(max(imageW,max(s['px']+s['pw'] for s in items))+padX+12)
 height=math.ceil(max(imageH,max(s['py']+s['ph'] for s in items))+padY+8)
 captions=[{'x':round((s['px']+padX)/width*100,5),'y':round((s['py']+padY)/height*100,5),'width':round(s['pw']/width*100,5),'text':s['text'],'lineCount':len(s['text'].split('\n'))} for s in items]
 for caption,item in zip(captions,items):
  if item.get('title'):caption['title']=True
 image={'x':round(padX/width*100,6),'y':round(padY/height*100,6),'width':round(imageW/width*100,6),'height':round(imageH/height*100,6)}
 d={**g['diagram'],'asset':'assets/diagram-'+job+'-source-v2.png','width':width,'height':height,'minWidth':width,'image':image,'captions':captions,'layoutVersion':2,'lineHeight':LINE,'inputWidth':GAP,'backgroundRemoved':True}
 # Only source-derived raster assets are approved. A previous SVG revision
 # was rejected by the user; never select it again based on file presence.
 import hashlib
 review=rasters[job];d['asset']=review['asset'];asset=ROOT/'dist'/d['asset']
 assert hashlib.sha256(asset.read_bytes()).hexdigest()==review['imageSHA256'],(job,'source raster changed without review')
 d.update(sourceId=review['sourceId'],sourceSHA256=review['sourceSHA256'],sourcePage=review['sourcePage'],sourceCrop=review['sourceCrop'],artworkVersion=review.get('artworkVersion','source-raster-v2'),artworkReview=review['method'] if job in uploads else g['diagram'].get('artworkReview',review['method']),artworkSHA256=review['imageSHA256'])
 # Explicit text lines and dimensions make overlaps checkable without relying
 # on a headless DOM's zero-sized getBoundingClientRect implementation.
 overlaps=[]
 for i,u in enumerate(items):
  for v in items[i+1:]:
   ix=min(u['px']+u['pw'],v['px']+v['pw'])-max(u['px'],v['px']);iy=min(u['py']+u['ph'],v['py']+v['ph'])-max(u['py'],v['py'])
   if ix>1 and iy>1:overlaps.append((u['text'],v['text'],round(ix,2),round(iy,2)))
 if overlaps:raise ValueError((job,'caption overlaps',overlaps))
 if a.qa:
  a.qa.mkdir(parents=True,exist_ok=True);im=Image.new('RGB',(width,height),'white')
  art=Image.open(ROOT/'dist'/d['asset']).convert('RGBA').resize((round(imageW),round(imageH)),Image.Resampling.LANCZOS)
  im.paste(art,(round(padX),round(padY)),art);draw=ImageDraw.Draw(im)
  for s in items:
   font=TITLE_FONT if s.get('title') else FONT
   xx=s['px']+padX;yy=s['py']+padY
   for line in s['text'].split('\n'):
    x=xx
    for token in re.split(r'(\{\{\d+(?::\d+)?\}\})',line):
     if token.startswith('{{'):
      draw.rounded_rectangle((x,yy+2,x+GAP-1,yy+24),2,fill='white',outline='#888');num=token[2:-2].split(':')[0];draw.text((x+(GAP-FONT.getlength(num))/2,yy+3),num,font=FONT,fill='black');x+=GAP
     else:draw.text((x,yy+3),token,font=font,fill='black');x+=font.getlength(token)
    yy+=LINE
  im.save(a.qa/(job+'.png'))
 return d
report=[]
for path in a.lessons.glob('*.json'):
 d=json.load(open(path));job=d.get('conversion',{}).get('jobId')
 if job not in spec:continue
 if job in uploads:
  u=uploads[job]
  source={'id':u['sourceId'],'role':'user-supplied-diagram','sha256':u['sourceSHA256'],'filename':u['uploadedName']}
  if not any(s['id']==source['id'] for s in d.get('sources',[])):d.setdefault('sources',[]).append(source)
 for g in d['groups']:
  if g['type']!='diagram':continue
  g['diagram']=build(job,g);report.append({'job':job,'lessonId':d['id'],'width':g['diagram']['width'],'height':g['diagram']['height'],'captionCount':len(g['diagram']['captions']),'labelOverlaps':0,'gapBelowFigure':18,'fixedBakedLabels':['R/V KALINDI','CENTRAL UPLIFT'] if 'lake-bosumtwi' in job else []})
 path.write_text(json.dumps(d,ensure_ascii=False,indent=2))
assert len(report)==16,len(report)
(ROOT/'import/diagram-layout-refinement-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print('Updated 16 diagrams; no label overlaps.')
