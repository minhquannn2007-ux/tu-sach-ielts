# Hướng dẫn tiếp tục Tủ Sách IELTS

Đọc README.md, HANDOFF.md và CONTENT_AUTHORING.md. Repository GitHub này là nguồn chung; lấy main mới nhất và không deploy vào project Sites cũ. HANDOFF là snapshot 18/10/2026; thông tin sau đó lấy từ source và manifest hiện hành.

Giữ giao diện thi máy, trang chủ tím và logo IELTS đỏ. Không viết lại engine. dist/reading-sample.html là CSS chuẩn; đồng bộ bằng scripts/sync-question-template.mjs khi sửa. Bài mới dùng JSON và shared exam, mode practice, không bịa đáp án.

Đọc instructions PDF từng nhóm: CBT không có below, answer sheet hay câu dẫn Do the following statements agree. Chỉ cho reuse khi nguồn cho phép. Notes và tables giữ đúng in đậm, thụt lề, hàng và ô. Mỗi footnote là một đoạn nghiêng riêng. MCQ và token kéo thả bỏ mã chữ cái thi giấy; matrix giữ letters. Headings kéo về được và xử lý example đúng. Giữ bảy diagram upload overrides; Tikopia dùng 130653 và hai title in đậm. Không phục hồi SVG vẽ lại.

Có hai bài The Voynich Manuscript P3 khác nhau, hiện mới đăng một bài. So nguồn và tách ID có bằng chứng, không loại vì trùng title. Giữ các hardhold trong import/source-content-holds.json.

Không đoán nguồn mờ hoặc mất câu. Draft và OCR không tự được duyệt. Chỉ publish allowlist có review và source hash. Regenerate catalog sau thêm bài. Kiểm: node scripts/check-reviewed-data.mjs; node scripts/check-github-pages.mjs; DOM tests theo thay đổi. Nộp và hơn năm câu trả lời mới hoàn thành; Full Test 13+13+14=40 câu. Bài lẻ và Full Test đều hỏi thời lượng 1–120 phút nguyên trước khi bắt đầu, trên 5 phút chỉ hiện phút, từ 5 phút trở xuống hiện phút/giây và tự nộp khi hết giờ.

Pages workflow tự deploy dist/ khi main thay đổi. Không commit token, cache hay node_modules. Không ghi đè thay đổi của tài khoản khác: lấy main mới, giải quyết conflict hoặc tạo pull request. Tránh sửa đồng thời cùng bài.

Chỉ lấy Word trực tiếp trong word ielts/p1 (116hQOjXoyZU2xggm71QxD0JNhUacSuQ0), p2 (1UaxL8QbgmK966Oy2IqN28FwLibG2nqF4), p3 (1WbEAa27WYEvDuEiaCIHyVjKVIVgqMepT). Kiểm tra parent_ids thực tế từ Drive; không lấy thư mục khác hoặc thư mục con, kể cả trùng tên bài. Index cũ chưa có parent_ids phải xác minh trước khi dùng. From princes to paupers đã bị người dùng xác nhận fake và cấm đăng lại; giữ nguyên bài Goya cũ.

Listening: xuất bản trên GitHub Pages của repository này. Mỗi part là một bài riêng có audio tương ứng và ảnh bìa thật đúng nội dung. Part 1/4 lấy title trong đề; Part 2/3 ưu tiên title, nếu thiếu dùng tên map hoặc instruction matching. Không dùng ảnh bìa không liên quan.

## Bàn giao liên tục — yêu cầu người dùng 21/10/2026

File bàn giao hiện hành trong ChatGPT Library: `Tu_Sach_IELTS_Ban_Giao_Lien_Tuc.md`, Library ID `libfile_fe0ddca400b48191847c4497be916115`. Người dùng có thể gửi bản Markdown này vào chat mới. Đọc bản hiện hành cùng source mới nhất; HANDOFF.md trong repo là snapshot cũ, không phải trạng thái live.

Sau mỗi lượt liên quan Tủ Sách IELTS có yêu cầu/quyết định/lưu ý/thay đổi/kết quả mới, cập nhật chính file bàn giao đó trước khi kết thúc. Sửa trạng thái hiện hành và thêm nhật ký ngắn: ngày, việc đã làm, kiểm tra/deploy, việc còn dở. Giữ Library identity và lịch sử phiên bản; không tạo bản riêng mỗi lượt, không chép log/mã nguồn lớn/Base64/token vào Markdown. Nếu được gửi file thay vì có Library connector, cập nhật file được gửi và trả lại bản mới; nói rõ nếu không lưu cập nhật được. Không hứa có tiến trình tự cập nhật sau khi lượt chat kết thúc.

Quy tắc đáp án mới hơn hướng dẫn practice/no-key ban đầu: người dùng đã yêu cầu lời giải và chấm Reading sau nộp. Đọc `import/answer-review/README.md`; key được review nằm ở `dist/answer-keys.json` và progress trong `import/answer-review/progress.json`. Chỉ bật key đầy đủ, đúng fingerprint, có evidence; thiếu key thì giữ ungraded. Không kết luận bài practice chưa có key chỉ vì lesson JSON không có trường key.

## Listening maps — quy tắc thay thế ngày 22/10/2026

Người dùng không chấp nhận bản map trợ lý tự làm nét và đã gửi bản tự xử lý 131217.png. Từ nay không tự làm nét, làm phẳng hay dựng lại map thay người dùng. Khi người dùng hỏi danh sách map, rà soát đủ Drive (kể cả pagination) và đưa tên toàn bộ bài map, kèm set/part để phân biệt; người dùng chủ động làm nét ảnh rồi gửi lại. Với bản người dùng gửi, chỉ tách nền trong suốt, giữ nguyên hình/chữ/đường đi/vị trí, rồi đăng lên website khi được yêu cầu. Quy tắc này thay thế quy trình tự phục hồi PAPER và tự vẽ lại PDF map đã ghi trước đó. Không quét Drive ngay chỉ vì ghi chú quy tắc cho tương lai.
