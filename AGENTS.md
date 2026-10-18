# Hướng dẫn tiếp tục Tủ Sách IELTS

Đọc README.md, HANDOFF.md và CONTENT_AUTHORING.md. Repository GitHub này là nguồn chung; lấy main mới nhất và không deploy vào project Sites cũ. HANDOFF là snapshot 18/10/2026; thông tin sau đó lấy từ source và manifest hiện hành.

Giữ giao diện thi máy, trang chủ tím và logo IELTS đỏ. Không viết lại engine. dist/reading-sample.html là CSS chuẩn; đồng bộ bằng scripts/sync-question-template.mjs khi sửa. Bài mới dùng JSON và shared exam, mode practice, không bịa đáp án.

Đọc instructions PDF từng nhóm: CBT không có below, answer sheet hay câu dẫn Do the following statements agree. Chỉ cho reuse khi nguồn cho phép. Notes và tables giữ đúng in đậm, thụt lề, hàng và ô. Mỗi footnote là một đoạn nghiêng riêng. MCQ và token kéo thả bỏ mã chữ cái thi giấy; matrix giữ letters. Headings kéo về được và xử lý example đúng. Giữ bảy diagram upload overrides; Tikopia dùng 130653 và hai title in đậm. Không phục hồi SVG vẽ lại.

Có hai bài The Voynich Manuscript P3 khác nhau, hiện mới đăng một bài. So nguồn và tách ID có bằng chứng, không loại vì trùng title. Giữ các hardhold trong import/source-content-holds.json.

Không đoán nguồn mờ hoặc mất câu. Draft và OCR không tự được duyệt. Chỉ publish allowlist có review và source hash. Regenerate catalog sau thêm bài. Kiểm: node scripts/check-reviewed-data.mjs; node scripts/check-github-pages.mjs; DOM tests theo thay đổi. Nộp và hơn năm câu trả lời mới hoàn thành; Full Test 13+13+14=40 câu. Bài lẻ và Full Test đều hỏi thời lượng 1–120 phút nguyên trước khi bắt đầu, đếm phút và tự nộp khi hết giờ.

Pages workflow tự deploy dist/ khi main thay đổi. Không commit token, cache hay node_modules. Không ghi đè thay đổi của tài khoản khác: lấy main mới, giải quyết conflict hoặc tạo pull request. Tránh sửa đồng thời cùng bài.
