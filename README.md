# Tủ Sách IELTS

Kho mã nguồn chung cho hai tài khoản ChatGPT. Website static, không cần login để làm bài.

Checkpoint nhập từ Sites ngày 18/10/2026: **520 bài** =509 bài JSON + 11 HTML cũ; P1 179, P2 177, P3 164. Website Sites cũ giữ nguyên, repository này là nguồn cho website GitHub Pages.

## Xuất bản

Repository Settings → Pages → Build and deployment → Source: **GitHub Actions**. Workflow `.github/workflows/pages.yml` tự kiểm dữ liệu và deploy **chỉ dist/** khi main có commit mới. Nếu lần đầu chưa bật Pages thì bật trong Settings rồi Actions → Publish Tủ Sách IELTS → Run workflow. Dùng URL mà GitHub Pages trả; không dùng ID Sites cũ.

## Cả hai tài khoản ChatGPT cùng làm

Ở mỗi tài khoản ChatGPT, kết nối GitHub tới tài khoản có quyền ghi repository này. Nếu dùng hai tài khoản GitHub khác nhau, chủ repository cần mời collaborator phù hợp. Kết nối Google Drive riêng, bảo đảm có quyền đọc folder nguồn.

Yêu cầu ChatGPT đọc AGENTS.md và HANDOFF.md trước khi sửa. Luôn lấy main mới nhất trước khi làm, không sửa hai lượt đồng thời; ưu tiên branch riêng + pull request nếu hai người đang làm song song. Chỉ cập nhật main sau khi resolve conflict và checks pass. Chạy `node scripts/publish-reviewed-lessons.mjs` nếu thêm bài; canonical sampleCSS phải sync khi sửa style.

Không đưa `.openai/hosting.json`/projectID cũ vào quy trình deploy mới. Không dùng Sites save/deploy để cập nhật URL GitHub Pages. Không upload ZIP cũ thay cho source mới nhất.

## Nội dung

- dist/: bài đọc, JSON catalog, assets và engine dùng chung.
- scripts/: bộ chuyển native/OCR, adapters và kiểm tra.
- import/: jobs, source-review, transcripts và các holds. Không được tự publish draft.
- HANDOFF.md: toàn bộ yêu cầu/source folder/tiến độ/CSSsnapshot/lỗi cũ. Thông tin live Sites trong đó là lịch sử, GitHub main hiện hành mới là nguồn để tiếp tục trên website này.

Có hai The Voynich Manuscript P3 khác nhau. Mới có một bản trên web; đừng dedup bản thứ hai bằng title. Giữ 14 source-content holds. Bài mới practice không bịa key/score. Thay domain không mang theo lịch sử localStorage của origin cũ.
