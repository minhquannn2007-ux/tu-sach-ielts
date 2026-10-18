# TỦ SÁCH IELTS — BÀN GIAO TOÀN BỘ CHO CHATGPT MỚI

**Ngày chốt: 18/10/2026 (Việt Nam).** Đây là tài liệu khôi phục ngữ cảnh, yêu cầu sản phẩm, hướng dẫn chuyển đề và trạng thái kỹ thuật. Đọc toàn bộ trước khi sửa hoặc nhập thêm bài. Mục tiêu: khi người dùng nói “tiếp tục nhập bài hàng loạt”, có thể tiếp tục trên đúng website, đúng bộ chuyển, đúng giao diện, không dựng lại dự án từ đầu.

> Tài liệu phân biệt rõ: yêu cầu người dùng; hành vi đã triển khai; giới hạn/chỗ chưa làm. Một yêu cầu từng được nhắc không có nghĩa tính năng đó đã hoàn thành. Mã nguồn và nguồn PDF hiện hành phải được kiểm tra lại sau khi mở phiên làm việc mới. Những chú thích README cũ có thể đã lỗi thời.

## 1. Người dùng muốn gì

- Website tên **Tủ Sách IELTS**, tone tím, dùng miễn phí hoàn toàn, không trả phí duy trì hay phí chuyển đề/OCR. Dùng cho người dùng và vài người quen; mở URL là làm, không đăng ký tài khoản.
- Ưu tiên máy tính; tablet/iPad phải có trải nghiệm hai khung giống máy tính, kéo được thanh chia và font gần Arial nhất có thể.
- Giao diện bài thi mô phỏng IELTS Reading trên máy/Inspera theo các HTML đã có và sample. Không tự thay bằng giao diện quiz chung chung.
- Người dùng gửi PDF gõ lại, scan, ảnh chụp giấy, hoặc HTML đã tự làm. Cần chủ động lấy đề từ Drive và nhập nhiều bài, nhanh, nhưng không đoán chữ/câu hỏi hoặc bỏ kiểm tra để tăng số lượng.
- Người dùng thích câu trả lời ngắn, đúng trọng tâm. Khi hoàn thành lượt nhập: nói rõ bao nhiêu bài, các tên bài, tổng mới và URL. Không tuyên bố “đã up” nếu mới tạo draft.
- Không nhắn xin xác nhận lặp lại cho việc đã được giao; hoàn thành kiểm tra và xuất bản trong cùng phiên nếu có đủ khả năng. Không có tiến trình tự chạy tiếp sau khi lượt chat kết thúc.
- Đã từng hỏi bỏ dấu vết ChatGPT trong URL nhưng sau đó nói “thôi không cần”; giữ URL hiện tại, không tự đổi domain/slug.

## 2. Website và trạng thái hiện tại đã xác minh

| Thuộc tính | Giá trị |
|---|---|
| Website | https://tu-sach-ielts.maplefly4.chatgpt.site |
| Tên | Tủ Sách IELTS |
| Sites project_id | `appgprj_6aca631963ec8191ad2e71e13b34ef7a` |
| Quyền truy cập | Public; giữ nguyên |
| Checkout lúc bàn giao | `/workspace/sites/tu-sach-ielts` |
| Hosting manifest | `.openai/hosting.json` → `static.directory = dist` |
| Phiên bản website | **99**, xác nhận bằng Sites get_site ngày 18/10/2026 |
| Commit đã xuất bản | `5dacf3026755fc8f201e3e10c8d566a811d6901f` |
| Saved version ID | `appgprj_6aca631963ec8191ad2e71e13b34ef7a~appgver_45fa078726f0819199c0965639ba5517` |
| Deployment thành công | `appgdep_6ad23cd03f448191826f81485a5d695e` |
| Thời điểm publish | 16/10/2026, 22:04 giờ Việt Nam |

### Số bài thực tế

| Passage | JSON dùng chung | HTML cũ | Tổng trên web |
|---|---:|---:|---:|
| Passage 1 | 177 | 2 | **179** |
| Passage 2 | 171 | 6 | **177** |
| Passage 3 | 161 | 3 | **164** |
| **Tổng** | **509** | **11** | **520** |

Nguồn đếm: `dist/lesson-catalog.json` + 11 thẻ HTML cũ trong `dist/index.html`. Không đếm số file asset, số lượt làm hoặc số dòng jobs thành số bài trên web.

**Lượt mới nhất, batch 34:** 4 Passage 3, 56 câu, practice không đáp án:
1. Learning to be bilingual
2. Game theory
3. Australia’s Megafauna Controversy
4. Is Teleworking Sustainable?

Các batch 33/34, manifest và source-review vẫn ở repo. Không nhập lại chúng. Những lượt cuối về ảnh diagram không làm tăng số bài.

### Cẩn thận với mẫu số “tổng kho đề”

`import/drive-inventory.json` là bản kiểm kê **12/10/2026**, gồm **799 mục cấp ngoài**, trong đó 398 là folder, tổng **1.148 file nguồn**. Phân bố 799 mục: P1 267, P2 285, P3 247. Đây không phải khẳng định 799 bài duy nhất. Grouping tạm tạo **779 jobs**, có các bản/nguồn cùng bài và có cả bài khác nhau nhưng trùng tên.

Chat trước từng trả lời 516/799, còn 283 bằng phép trừ đơn giản. **Không dùng phép trừ đó để khẳng định chính xác số bài chưa đăng.** Sau batch 34, jobs có 511 `reviewed`, 164 `text-prepared`, 104 `queued` = 779; số job reviewed không bằng số bài JSON. Hàng chờ có **268 jobs chưa reviewed**, vẫn gồm bản nguồn cần đối chiếu, không phải 268 bài duy nhất chắc chắn còn thiếu. Hai bài Voynich còn cần tách đúng. Nếu người dùng cần mẫu số duy nhất chính xác: đối chiếu nội dung/source ID trước, hoặc nêu rõ đơn vị là mục nguồn/jobs.

## 3. Nguồn Drive — lấy đề ở đâu

Ba folder gốc đã tìm lại bằng Google Drive ngày 18/10/2026:

| Passage | Folder ID | Link |
|---|---|---|
| 1 | `1cGZIepYJlgFvz83LeLMrMuy11IW-ItQA` | https://drive.google.com/drive/folders/1cGZIepYJlgFvz83LeLMrMuy11IW-ItQA |
| 2 | `1PyqhFBi9vYXXO64fLYQcVoLf2vlYGYzP` | https://drive.google.com/drive/folders/1PyqhFBi9vYXXO64fLYQcVoLf2vlYGYzP |
| 3 | `1WKb4nEWek62YW_RuvVNsN77kvo7mvjlV` | https://drive.google.com/drive/folders/1WKb4nEWek62YW_RuvVNsN77kvo7mvjlV |

- Các folder bài có thể chứa PDF, PAPER, nhiều phiên bản, scan và ảnh. Đọc metadata và liệt kê đủ các trang kết quả; fetch folder chỉ có thể trả tối đa 100 con nên không coi một kết quả là toàn bộ folder lớn.
- Dùng Google Drive connector đã kết nối, không yêu cầu người dùng tải từng file hoặc cung cấp API key khi có thể lấy trực tiếp.
- Metadata nguồn cụ thể và URL đã lưu trong `import/jobs.json` và inventory. Tên folder/filename có thể chứa ghi chú “chưa rep”, “sai”, hoặc khác title in trong đề. Title trên trang gốc mới là căn cứ.
- Fetch file nhị phân không native: `fetch(url=<URL nguồn>, download_raw_file=true, include_base64=false)`. Dùng `file_uri` được trả để tải vào cache scratch `<source-id>.pdf`. Không export PDF qua API export Google Docs. Không lưu bearer/signed URL hay token vào repo/Markdown.
- Không sửa/xóa/di chuyển đề gốc trên Drive khi nhiệm vụ chỉ là nhập website.
- Nếu cache mất: lấy lại đúng source ID qua connector; so SHA-256 trước khi tái sử dụng bản OCR hoặc source-review cũ. Không cho rằng ảnh upload cũ trong chat vẫn tồn tại theo đường dẫn scratch.

## 4. Ngoại lệ quan trọng: TWO “The Voynich Manuscript”

**Người dùng khẳng định có HAI bài Passage 3 cùng tên The Voynich Manuscript và chúng khác nội dung. Phải đưa đủ cả hai lên website. Không loại bài thứ hai vì title trùng.**

Trạng thái lúc bàn giao: chỉ một lesson `p3-the-voynich-manuscript` đã đăng; `jobs.json` còn gộp các nguồn dưới một job cùng ID. Ba nguồn hiện được gộp:

- `1WRIhsNX8d012dP8BF91KHXIod78xGwpT` — The Voynich Manuscript.pdf
- `1PXg7YXPv5G3-h_l1zCKo1U6-jVVFyhSN` — PAPER
- `1Dro1-3bpkZqLqhDX2u5zURN-uYRk_iWS` — PDF

**Chưa kiểm tra được nguồn nào thuộc bài thứ hai; chưa tách job/chưa đăng bài thứ hai.** Chat trước đã ghi nhận lời dặn bằng hội thoại, chưa sửa bộ dedup. Đây là việc cần làm khi nhập tiếp: so toàn bộ reading + question set + nguồn trong folder, phân thành hai bài thật; cấp ID riêng ổn định (có suffix phân biệt nếu cần), giữ cả hai title gốc hoặc nhãn “Bản 1/Bản 2” ở giao diện nếu cần để chọn. Không tạo bài thứ hai chỉ bằng đổi tên JSON cũ. Không vô hiệu hóa toàn bộ duplicate gate: thêm ngoại lệ có bằng chứng, gắn source ID và lý do. Các publisher cũ có gate `same part + normalized title`; phải điều chỉnh có kiểm soát cho trường hợp này trước khi xuất bản bản thứ hai.

## 5. Trang chủ và chế độ làm bài

### Trang chủ
- Tone tím; mỗi thẻ bài có ảnh thật liên quan topic, tên bài, Passage, dạng câu hỏi bằng **tiếng Anh**, trạng thái đã làm.
- Ảnh: trợ lý tự chọn ảnh thật trên mạng; tái dùng cover phù hợp đã có cùng metadata nguồn/license thay vì kiếm lại mỗi lần. Không dùng ảnh AI minh họa bìa nếu trái yêu cầu ảnh thật.
- Lọc Passage 1/2/3; ô tìm tên bài thẳng hàng với bộ lọc, ở lề phải.
- Sắp xếp A–Z chung cả HTML cũ và JSON mới, sau khi catalog load xong. Lỗi cũ: Australia’s Camouflaged Creatures bị rơi xuống cuối thay vì nhóm A.
- Bỏ dấu chấm trang trí giữa các mục như “Full Test . 60 phút”; hiển thị tự nhiên “Full Test 60 phút”.
- Nút Full Test 60 phút mở hai lựa chọn **Random** và **Tự chọn bài**. Tự chọn đúng một bài mỗi Passage.

### Bài lẻ
- Không giới hạn thời gian.
- Chỉ tính đã làm sau **nộp bài** và có **hơn 5 câu** đã trả lời. Từ 0 đến 5 câu vẫn chưa hoàn thành.
- Có lưu draft/khôi phục; không đánh dấu hoàn thành chỉ vì mở bài hay gõ vài câu.
- Yêu cầu ban đầu: nộp xong có điểm/đáp án/giải thích, click từng câu để hiện giải thích và tô dẫn chứng ngay trong reading. Đây vẫn áp dụng cho bài có key sẵn.
- **Quyết định mới hơn ưu tiên khi nhập hàng loạt:** người dùng không cần up đáp án; tự kiểm sau khi làm. Bài mới dùng `mode: "practice"`, không `key`, không điểm, không bịa giải thích/đáp án. Hiện đáp án người dùng đã làm để họ tự xem. Bài graded cũ giữ tính năng vốn có.
- Highlight/note đã từng được để sau; repo hiện có `exam-tools.js` và `exam-behavior.*`. Không hứa trạng thái công cụ chỉ dựa trên yêu cầu cũ; kiểm tra trực tiếp nếu sửa.

### Full Test
- 1 P1 ×13 câu + 1 P2 ×13 + 1 P3 ×14 = **40 câu**; **60 phút**, hết giờ **tự nộp**.
- Người dùng xác định luôn 13/13/14; không gán bài khác range vào set cho đủ số lượng.
- Random ưu tiên bài chưa hoàn thành của từng Passage; hết pool chưa làm thì dùng lại bài cũ.
- Lấy/chọn set không tạo lịch sử hoàn thành. Chỉ ghi history khi nộp, từng Passage vẫn áp dụng ngưỡng >5 câu.
- Đóng/thoát không tính đã làm; các bài đó vẫn được random lại. Có lưu set đang làm để tiếp tục khi chọn resume; mở random mới không mặc nhiên tính set cũ là đã làm.
- Yêu cầu timer: đóng trang thì dừng; mở lại mới chạy tiếp. Đừng trừ thời gian đóng trang khỏi 60 phút. Tab ẩn và đóng trang là hai sự kiện khác; giữ logic đã có, kiểm tra bằng test trước khi đổi.
- Giữ UI bài lẻ khi ghép set: logo chữ **IELTS đỏ**, hai khung, các câu hỏi; không thay engine bằng giao diện mới.
- Không hiện 3 thanh Part bị lặp/chồng trong 3 iframe. Shell điều khiển một thanh chung, đổi Part mà không mất đáp án, phân bố số câu 1–13/14–26/27–40 đúng.
- Có trạng thái đang lấy đề/loading; hình mẫu người dùng từng gửi không còn đọc được từ scratch trong bản bàn giao. Không tự nói đã đối chiếu chính xác hình đó nếu không có ảnh.
- Trạng thái localStorage theo trình duyệt/thiết bị, không có tài khoản/backend đồng bộ history.

## 6. Chuẩn hình thức bài đọc và tổng thể

1. **Giữ giao diện hiện tại đã phục hồi**, trước đợt người dùng gửi file CSS/code Inspera. Đã thử đổi theo code Inspera rồi bị yêu cầu hoàn tác. Không áp lại đợt redesign đó.
2. Sample chính: `dist/reading-sample.html`, toàn bộ kiểu câu hỏi trong scaffold Goya. Đây là giao diện thi máy có thao tác thật, không phải trang gallery kiểu câu hỏi.
3. Mỗi PDF mới phải xem sample và bài cũ cùng dạng trước khi adapt. Không tạo kiểu control riêng/generic.
4. Title giữ đúng hoa/thường của đề: **AVALANCHES** khi đề in như vậy; **The Spinning Jenny** khi đề viết như vậy, không tự ALL CAPS mọi title.
5. Subtitle là riêng một phần, căn trái, italic và cỡ giống Goya (reference `.passage-sub` 18px, line-height 1.35; xem CSS thực để biết cascade). Không nhập subtitle thành đoạn đầu reading. Nối soft wrap từ PDF thành một đoạn; chỉ để trình duyệt tự xuống dòng theo chiều rộng.
6. Paragraph A/B/C nếu dạng cần: đặt `.para-lbl` inline trong `.passage-para`, không tạo cột flex riêng; không gộp/mất đoạn khi PDF hai cột. Theo thứ tự đọc từng cột, giữ đoạn tiếp nối qua cột/trang.
7. Matching Headings: không hiện chữ A/B/C ở đầu đoạn. Giữ liên kết câu hỏi–đoạn bằng index nội bộ. Nếu bài còn dạng khác cần letters, kiểm tra ngữ cảnh; không xóa nội dung chỉ vì chữ đầu câu là “A”.
8. Footnote: giữ đủ mọi định nghĩa, italic, cách reading một khoảng nhỏ; **mỗi mục footnote một dòng/paragraph riêng**. Nối soft-wrap trong một định nghĩa, không nối hai định nghĩa với nhau. Cho phép một footnote dài tự wrap ở viewport hẹp; không nowrap gây mất chữ. Ví dụ Pluto Seen up Close từng gộp hai footnote sai.
9. `.sec-hdr` câu hỏi 16px đậm; `.sec-inst` 16px/1.5; giữ spacing theo mẫu chứ không lấy font/layout đề giấy.
10. Radio/checkbox phải thẳng hàng với text; không để vòng tròn trôi cao/thấp. Không nhân đôi ô native và ô custom. Vùng hover xám/selected xanh đủ rộng như mẫu.
11. Không nhét chi tiết kỹ thuật/bộ chuyển hoặc cảnh báo chất lượng giả định vào luồng làm bài của học viên.

## 7. Sample, CSS dùng chung và sửa một chỗ

**Nguồn CSS câu hỏi chuẩn:** `<style id="ielts-question-template">` trong `dist/reading-sample.html`.

- Muốn sửa hình thức dạng bài: sửa block đó; chạy `node scripts/sync-question-template.mjs`.
- Script sinh `dist/question-template.css`, gắn shared links vào HTML legacy, chuẩn hóa instruction containers. Không sửa trực tiếp CSS sinh ra rồi bỏ quên sample.
- `dist/question-template.js` lấy CSS sample khi load; generated CSS làm fallback tức thời. Không inject HTML/script sample vào nội dung đề.
- CSS chia theo `data-question-type`; hiện sync gate kiểm **14 variants**. Tài liệu cũ ghi 12/13 đã lỗi thời. `mc-two` còn hỗ trợ selectionCount=3; sentence/table là các task của schema.
- Thay cấu trúc/interaction cần sửa sample, rồi renderer/legacy đúng dạng. **Sửa sample không tự động thay DOM/JS hay lời câu hỏi ở mọi bài**; không hứa cơ chế tự chiếu toàn bộ nếu code chỉ đồng bộ CSS.
- `exam-engine.js` render nội dung từ JSON vào `exam.html`; `exam-data.js` validate và tạo CBT instructions. Bài mới không cần một HTML standalone mỗi bài.
- Mọi lesson dùng `zoom-layout.css/js`, question template, behavior/progress shared phù hợp. Footer thuộc `exam-progress.*` + `exam-behavior.*`; không fix footer từng file mà bỏ shell/full test.
- Diagram geometry/arrows/ảnh là riêng từng bài; sửa sample không tự đo lại tọa độ diagram của bài khác.

### Các file cần đọc đầu tiên

| File | Vai trò |
|---|---|
| `CONTENT_AUTHORING.md` | Quy tắc authoring gốc; có vài dòng cũ cần ưu tiên ghi đè bằng tài liệu này |
| `dist/reading-sample.html` | Mẫu UI/interaction 14 variants và CSS canonical |
| `dist/question-template.css/js` | CSS sinh + loader |
| `dist/exam.html`, `exam-engine.js/css`, `exam-data.js` | Khung dùng chung, controls, schema, instructions |
| `dist/zoom-layout.css/js` | Font, responsive, zoom, divider touch |
| `dist/exam-progress.css/js`, `exam-behavior.css/js` | Thanh Part/progress/focus chung |
| `dist/home-controls.*`, `lesson-catalog.*`, `index.html` | Filter/search/cards/sort/entry |
| `dist/full-test.html/css/js`, `full-test-core.js` | Set random/tự chọn, timer, iframe, nộp/history |
| `dist/lessons/*.json` | 509 bài có cấu trúc |
| `dist/bai/*.html` | 11 bài cũ |
| `import/README.md`, batch README/source-review | Lịch sử chuyển và các source-specific fixes |

**Những hướng dẫn cũ bị ghi đè:** không “below” trong CBT; tablet breakpoint hiện 600px, không 760px; measured diagram input mới 180px, không lấy 174px áp ngược; ngoại lệ raster labels Lake/Torch được người dùng yêu cầu; số sample 14. Khi thấy tài liệu cũ xung đột, dùng yêu cầu mới và implementation đã kiểm tra.

## 8. Instructions CBT — bắt buộc đối chiếu từng group

PDF quyết định **nội dung tác vụ**, range câu, word/number limit, số đoạn/letters, bank đầy đủ, permission reuse, giới hạn paragraph nguồn. Sample quyết định cách diễn đạt thao tác trên máy. Không chép nguyên instructions thi giấy rồi chỉ thay font.

### Quy tắc chung

- Không có từ **below** trong instruction hiển thị: “Label the diagram”, “Complete the notes”, “Answer the questions”. Chỉ bỏ trong `.sec-inst`, không xóa từ below trong reading/câu hỏi/nội dung đáp án.
- Bỏ “Write the correct letter ... in boxes ... on your answer sheet”. Người học click/chọn/kéo nội dung.
- T/F/NG và Y/N/NG: bỏ câu hỏi dẫn **“Do the following statements agree ...?”**; giữ lời giải thích lựa chọn liên tục theo mẫu dưới.
- Không tự thêm reuse. **Avalanches** không có permission dùng letter nhiều lần trong nguồn, phải bỏ. Nếu nguồn cho phép mới `reuse:true`.
- Matching Information dùng số bằng chữ (seven), không số (7). Prompt + câu hỏi + câu reuse là **một paragraph liên tục**, không `<br>` ép tách. “Cùng một dòng” nghĩa cùng luồng nội dung, vẫn được tự wrap khi hẹp, không nowrap gây tràn.
- Word limit đúng nguyên nghĩa: ONE WORD ONLY; NO MORE THAN TWO WORDS; AND/OR A NUMBER; chỉ lấy từ paragraph C/D/E nếu có. Không bỏ scope đó khi adapt.
- Có source typo rõ (như “more than one” cho reuse) chỉ adapt sau review và ghi bằng chứng; không dùng nó làm quy tắc chung.

### Câu hiển thị chuẩn hiện hành

`[LIMIT]` là word limit gốc in đậm; `[from]` là “from the passage” hoặc đúng paragraph restriction. Xem hàm `IELTSData.instructions` trích nguyên ở phụ lục để có string chính xác.

| Dạng | Instructions CBT |
|---|---|
| True / False / Not Given | Choose **TRUE** if the statement agrees with the information, choose **FALSE** if the statement contradicts the information, or choose **NOT GIVEN** if there is no information on this. |
| Yes / No / Not Given | Choose **YES** if the statement agrees with the claims/views of the writer, choose **NO** if the statement contradicts the claims/views of the writer, or choose **NOT GIVEN** if it is impossible to say what the writer thinks about this. |
| Multiple Choice ONE | Choose the correct answer. |
| Choose TWO/THREE | Choose **TWO/THREE** correct answers. |
| Matching Information | The text has seven paragraphs, **A–G**. Which paragraph contains the following information? [You may choose any letter more than once. — chỉ khi nguồn cho phép] |
| Matching Names/Features | Choose the correct [targetName]. [You may choose any [targetName] more than once. — chỉ khi có] |
| Matching Headings | Choose the correct heading for each paragraph from the list of headings and move it into the gap. |
| Matching Endings | Complete each sentence with the correct ending. Choose the correct answer and move it into the gap. |
| Summary/Sentence/Notes/Table input | Complete the summary/sentences/notes/table. Write **[LIMIT]** [from] for each answer. |
| Summary kéo thả | Complete the summary [of scope nếu có] using the list of words. Choose the correct answer and move it into the gap. |
| Diagram input | Label the diagram. Write **[LIMIT]** [from] for each answer. |
| Diagram bank | Label the diagram using the list of words. Choose the correct answer and move it into the gap. |
| Flow-chart | Complete the flow-chart. Write **[LIMIT]** [from] for each answer. |
| Short answer | Answer the questions. Write **[LIMIT]** [from] for each answer. |

## 9. Chi tiết từng dạng bài và lỗi phải tránh

### 9.1 T/F/NG và Y/N/NG
- Dùng cấu trúc radio custom của Goya/Perfume và sample (`.ync-*`/`.tfng-*` hoặc class hiện hành). Một câu chỉ chọn một đáp án.
- Không hiện hai ô chọn cho một lựa chọn (native + custom). Giữ deselect, focus, footer mapping và restore.
- Instructions như mục 8; không bảng định nghĩa kiểu giấy, không câu dẫn Do the following...

### 9.2 Multiple Choice ONE; Choose TWO in FIVE / THREE
- Đáp án hiện **chỉ nội dung**, không A/B/C/D/E. Internal value vẫn giữ để lưu/restore.
- Không strip mất chữ A thật trong đầu nội dung như “A faster way...”.
- Choose TWO tham chiếu **Goya rồi John Ray**; không bó chiều ngang quá hẹp, option hit area/hover xám/selected xanh phải đủ rộng như TFNG.
- Canh ô tròn/checkbox với chữ. Đúng số selectionCount, giới hạn số chọn, bỏ/chọn lại được; nhóm 2 câu có mapping/progress đúng cả hai câu.
- Chọn THREE được hỗ trợ trong họ `mc-two`, không đổi mọi nhóm thành TWO. Word limit/rules vẫn theo nguồn.

### 9.3 Matching Information
- Matrix theo Goya/Seeing in the Sea: letters đoạn ở header cột, mỗi prompt một hàng radio. Không thay bằng dropdown/MCQ list.
- Letters đoạn vẫn được hiện, vì đây là danh tính paragraph, không phải mã A/B/C đáp án giấy cần loại.
- Giữ đủ A–G (hoặc range gốc), đúng số đoạn; không bịa labels hoặc reuse.
- Prompt liên tục theo mục 8, số đoạn bằng chữ.

### 9.4 Matching Names / Features / Organisations / Statements
- Tham chiếu **Australia’s Camouflaged Creatures** do người dùng gửi: matrix + list tương ứng ở dưới, không biến thành MCQ rời.
- Header cấu trúc **List of Names / List of Researchers / List of Statements**: L viết hoa, **of thường**, chữ đầu noun viết hoa. Không “List Of ...”, không tất cả lowercase/allcaps.
- Letter identifiers của matrix/list được giữ để ánh xạ. Quy tắc bỏ letters không có nghĩa xóa labels ma trận này.
- targetName/listTitle lấy theo nguồn thực; không mặc định researcher khi list là Technologies, People hoặc Organisations. Permission reuse explicit.

### 9.5 Matching Headings
- Theo **John Ray**, giữ ô trống bản gốc kiểu thi máy với số ở giữa; số 8 từng lệch phải sửa chính giữa cả hai chiều.
- Không letters A/B/C trước đoạn; heading kéo vào khoảng trên đoạn.
- Đã gắn vẫn kéo trở lại bank, chuyển ô khác, hủy drag ngoài target không làm mất token. Click-select rồi click-gap cũng cần hoạt động.
- Heading mã i/ii/iii nội bộ không hiện trên token/filled gap.
- **Nếu có example:** đặt chính nội dung heading mẫu in đậm trên đoạn tương ứng; không dư một token “example” trong bank; example không phải câu trả lời có thể thay. A Digital cinema of the mind từng sai ở đây.

### 9.6 Matching Sentence Endings
- Theo **On the Trail of the Artist(s)** và sample; `.me-sentence`, `.me-text`, gap + bank.
- Không letters đầu ending; token đã gắn kéo trả về được. Lỗi cũ endings không kéo về được phải giữ regression.
- Gap không quá cao chỉ vì một cụm ba từ; kích thước theo sample, nội dung đủ rộng khi cần.

### 9.7 Summary Completion input/kéo thả; Gap Filling; Sentence Completion
- Ô điền số placeholder theo sample; title phần gap/summary căn giữa, không tùy ý phóng cỡ.
- Summary kéo thả không có A/B/C trên bank/ghost/filled item. Design in the Modern World từng bị layout drop summary lỗi.
- Giữ paragraph breaks có ý nghĩa, title/scope, paired blanks; một question có thể có hai slots, không đếm sai thành hai câu.
- Sentence completion giữ từng câu theo nguồn, không đổi thành note bullet chung.

### 9.8 Note Completion / Table Completion
- **Phải giống cấu trúc PDF:** hàng in đậm, nghiêng, gạch chân, bullet/subbullet, thụt đầu dòng, hanging indent, heading, spacing, cells/rowspan/colspan. Không flatten note thành đoạn văn thẳng hàng.
- Note P1 người dùng đặc biệt nhấn mạnh phải giữ từng dòng và indentation. Glassmaking từng bị sai nhiều lần.
- `scripts/source-notes.py` trích typography/tọa độ native thành `noteLayout` rows/runs; scan cần đọc ảnh rồi dựng cấu trúc tương đương.
- Nối **xuống dòng OCR vô cớ** trong một ý, nhưng không gộp các dòng cấu trúc nguồn thật. Phân biệt soft wrap và bullet/row/heading.
- Bảng có date column, ô trống continuation, gộp ô phải giữ. Không ép thành summary text cho nhanh.

### 9.9 Short Answer Questions
- Tên dạng người dùng từng gọi “answer the questions below”; CBT bỏ below.
- Dùng wrapper matching endings của Trail nhưng **không endings bank**, thay bằng numbered input; exact word limit.

### 9.10 Flow-chart
- Bài thử **Searching for sustainable solutions to indoor air pollution**; dạng riêng `flow-chart`.
- Giữ mũi tên gốc/nguồn ảnh sắc nét mà người dùng chọn; không thay mũi tên mờ/cong/xấu. Đã có uploaded-arrow metadata ở `import/flow-user-arrow.json`, `air-flow-arrows.json`, `flow-arrow-vector-source.json` — đối chiếu phiên bản đang dùng trước khi thay.
- Text/inputs theo source và sample, nhánh/nút không che nhau. Giữ đúng word limit, không đổi flow-chart thành list câu điền dưới.

## 10. Diagram — lịch sử quyết định và trạng thái cuối cùng

### Ý đồ người dùng
- Giữ quan hệ vị trí chữ, mũi tên, vật thể như đề; blank ở đúng vị trí trong hình, **không liệt kê câu điền xuống dưới**.
- Dùng numbered inputs giống gap filling; đủ dài như Spinning Jenny, không hẹp.
- Refine không chỉ tăng contrast/zoom ảnh mờ. Người dùng từng muốn dựng ảnh bằng AI giống nhất có thể, chấp nhận có thêm chi tiết, rất không hài lòng SVG hoặc bản làm nét còn cong/vỡ. Một Olympic Torch preview từng được họ chấp nhận nhưng phiên bản lên web khác và xấu hơn; không tuyên bố preview và asset deploy là cùng một ảnh khi không phải.
- **Không phục hồi SVG redraw**: người dùng đã bác bỏ. Với sơ đồ cần chính xác, tuân thủ giới hạn công cụ hiện hành; nếu không được dùng generation cho nội dung chính xác thì giải thích đúng, đừng giả vờ đã dùng AI. Quyết định thực tế mới nhất: dùng ảnh nét hơn người dùng gửi, tách nền, giữ mũi tên, thay vào website.
- Tách nền trong suốt, chữ HTML đặt trực tiếp trên nền HTML, **không có miếng nền trắng**. Ví dụ set of eight rovings không nền trắng, các labels khác cũng vậy.
- **Ngoại lệ người dùng yêu cầu giữ chữ trong raster:** Lake Bosumtwi **R/V KALINDI**, **CENTRAL UPLIFT** giữ font gốc đi cùng ảnh. Hai panel header Olympic Torch cũng hiện được giữ trong ảnh. Không áp quy tắc HTML mọi chữ một cách máy móc.
- Trước đó Glass bell jar ở Perfume cần là HTML text ngoài ảnh, không để raster cố định.

### 16 bài diagram priority batch 33

1. A watchful eye on bridges — gap hình/choices từng quá xa.
2. Ancient Greek Coins — hình chưa nét, gap hình/câu dưới quá xa, title phải giữa.
3. Barrels — gap quá xa, title giữa.
4. Practical Action — câu chồng nhau, gap xa.
5. The History of Cakes at Weddings — câu chồng, gap xa, hình mờ.
6. The Olympic Torch — câu chồng, gap xa, hình mờ; không được che arrows.
7. The origins of cinema — input che mũi tên, title giữa, hình mờ, gap xa.
8. The treadle pump — gap xa, hình mờ.
9. The Tyne Bridge — câu chồng, gap xa, title giữa, hình mờ.
10. Tikopia — gap xa, title giữa, hình mờ; hai title phải đậm.
11. Lake Bosumtwi — title giữa, hình mờ; hai labels raster như trên.
12. Roller coaster — hình mờ.
13. Movement Underwater — câu chồng, hình mờ, title giữa.
14. Patterns of Nature — title giữa, câu chồng.
15. Termite Mounds — gap lớn tới Q38–40, hình mờ.
16. The secret sound(s) of elephants — title giữa, gap xa, hình mờ.

Tất cả đã có measured canvas/nguồn raster; 7 bài sau đã thay bằng upload nét hơn. **9 bài khác vẫn bị giới hạn bởi chất lượng nguồn PDF**, không nói toàn bộ đã đạt mức ảnh nét người dùng muốn.

### Bảy ảnh upload ưu tiên — không được revert sang PDF mờ

| Bài | Source filename giữ trong repo | Ghi chú |
|---|---|---|
| The treadle pump | `130634.png` | 1536×705 |
| The Olympic Torch | `130635.png` | 1536×1024; panel headers raster |
| Termite Mounds | `130636.png` | Nguồn upload nét hơn |
| Ancient Greek Coins | `130637.png` | Không đổi endpoint mũi tên Q9; crop title raster tránh lặp HTML |
| Movement Underwater | `130650.png` | 1536×1108 |
| Roller coaster | `130649.png` | 1536×1024 |
| Tikopia | **`130653.png`** | 1536×1399; mới nhất, full đuôi chisel + mũi tên Q9 |

- Nguồn gốc còn trong `import/diagram-upload-sources/`; hash + overrides tại `import/diagram-upload-overrides.json`. Không dựa đường dẫn upload scratch cũ.
- Tikopia: **Pigment production** và **Chisel** đều centered, bold 18px; Chisel phải thật sự đậm dù shared caption CSS dùng important. Đã có title metadata, font-metric bold và inline `font:700 18px/30px Arial !important` ở renderer.
- Tikopia dùng **130653**, không quay về bản 130645/ảnh đầu thiếu đuôi. Hình upload có top-left “6” trùng “6” bên phải và typo “hand”; HTML giữ numbering đã đối chiếu **5–9**, đúng “hard”. Đuôi số 9 không nhầm thành số 5. Không nhân bản typo từ ảnh vào câu thi.
- Pipeline upload giữ native pixels/geometry; paper → alpha; mask text cũ để HTML thế vào, bảo vệ pixels mũi tên. Không vẽ lại/thêm leader arrows.
- Tikopia chụp nền xám cần normalize nền **trước** mask text để không tạo block trắng; tối ưu này không làm mất nét đen/shading quan trọng.

### File và kích thước diagram hiện hành

- `scripts/refine-diagram-assets.py` → xử lý raster nguồn/upload và audit hashes.
- `scripts/layout-reviewed-diagrams.py` → measured canvas, labels, tọa độ, QA composite.
- `import/diagram-layouts.json`, `diagram-refinement-audit.json`, `diagram-layout-refinement-audit.json`.
- Measured `layoutVersion:2`: input **180×23px**, line-height **30px**, minWidth = canvas width; caption text 16px Arial. Title 18px bold centered; spacing title margin 12px 0 8px.
- Canvas có baseline art 800px; đa số upload 900, Olympic Torch 1000; chiều canvas/caption đo riêng. Không scale tọa độ bằng mắt theo viewport.
- `.reviewed-diagram-viewport` overflow auto; vùng nhỏ cho scroll ngang an toàn; không cắt mất chữ/hình. Không đẩy choices quá xa vì min-height thừa. Chặn legacy Perfume min-height observer làm méo `.shared-diagram`.
- Giữ labels/inp không va chạm/mũi tên; bounding box phải kiểm cả chiều cao nhiều dòng lẫn width input. Gap tới bank/câu sau gọn (viewport padding-bottom 8px, margin-bottom10px; bank margin-top8px hiện tại).
- Cũ Jenny minWidth700, Perfume760 vẫn áp cho legacy. Không thay fixed measured input180 bằng width100% ngẫu nhiên.
- `python scripts/layout-reviewed-diagrams.py --qa <scratch-dir>` tạo composite kiểm bằng Pillow; không gọi composite là screenshot trình duyệt.

## 11. Zoom, tablet/iPad và font

- Giữ browser zoom; không tuyên bố giới hạn zoom desktop bằng viewport meta. Không vô hiệu hóa zoom để che lỗi.
- Yêu cầu người dùng: text đi với process phải lớn theo zoom; ảnh/process giữ bố trí đã chấp nhận. Dùng canvas/min-width + scroll có kiểm soát để tránh crop/đè; không co cả chữ xuống tới không đọc được.
- Hiện **>=600 CSS px** giữ hai panes độc lập, divider hiển thị. **<600px** one-column cho điện thoại; đây là breakpoint mới sau yêu cầu tablet, thay mốc760 cũ.
- `.passage`, `.qpanel` min-width0, scroll riêng; bảng/matching matrix trong viewport cuộn ngang; không làm cả body tràn.
- Touch/pen divider dùng Pointer Events/capture, `touch-action:none`, xử lý pointercancel, bỏ secondary finger. Keyboard Left/Right/Home; desktop mouse không mất.
- Cỡ nút divider coarse pointer tối thiểu44×44.
- `-webkit-text-size-adjust:100%; text-size-adjust:100%` chống tablet tự phóng chữ.
- Font Arial local ưu tiên; bundle **Liberation Sans** 4 style ở `dist/assets/fonts` với metric tương thích để Android không rơi sang font khác. Không phải Microsoft Arial có license webfont; không hứa glyph raster giống 100% mọi thiết bị. Không có `font-compat.css` riêng; @font-face nằm trong `zoom-layout.css`.
- Chưa có kiểm thực trên iPad/Safari/physical tablet trong phiên trước; chỉ có DOM/pointer regression. Không báo đã nhìn trên tablet thật.

## 12. Thanh Part 1/2/3 — cực kỳ quan trọng

- Theo video và ảnh người dùng, áp dụng **toàn bộ HTML cũ + sample + engine + full-test shell**.
- Part active hiển thị dãy số câu; Part inactive hiển thị tên và số đã làm/tổng. Giữ IELTS đỏ phía trên.
- Viền focus/hover số câu màu xanh biển `#418fc6` theo shared CSS, 1px border +1px outline; không đánh viền sai số hoặc nhóm.
- Vạch phía trên câu đã trả lời màu xanh, dày hơn bản quá mỏng cũ; **CSS hiện tại height3px**, cùng gray placeholders. Không suy diễn user muốn5px nếu chưa thay.
- Vạch phải align với đúng bounding box số câu, không chia đều theo percent rồi lệch khi text/nhóm/horizontal scroll.
- Nhóm choose2/3 dùng dataset list câu và grouped control; không đếm chỉ một câu khi đã đủ hai/ba.
- Hiện `.bb-top-row`64px, question button32px min, font18, submit92px (responsive giảm); xem nguyên CSS phụ lục thay vì đoán.
- Footer tuyệt đối không bị lặp/chồng khi ghép ba bài; chuyển câu chuyển Part đúng và giữ answer state.

## 13. Bộ chuyển miễn phí và dữ liệu

### Cấu trúc quan trọng

| Đường dẫn | Nội dung |
|---|---|
| `import/drive-inventory.json` | Snapshot outer items/children nguồn |
| `import/jobs.json` | Queue resumable; status, sources, lesson_id, flags |
| `import/prepared/<source-id>.json` | OCR/native transcript, sha256, pages, boxes, confidence |
| `scripts/bulk-import.py` | Inventory/extract free; PyMuPDF native trước, Tesseract local scan |
| `scripts/convert-batch.py` | Chuyển concurrent/resumable, drafts/reports/private transcripts |
| `scripts/parse-practice.py` | Parser **v3.22** hiện tại |
| `scripts/source-notes.py` | Note/table typography/layout |
| `scripts/validate-conversion.mjs`, `check-reviewed-data.mjs` | Schema/source/number gates |
| `scripts/select-download-batch.py` | Chọn metadata nguồn chưa cache |
| `scripts/audit-source-batch.py` | Source audit/contact sheet |
| `scripts/reviewed-ocr.py` | Helpers adapter scan source-reviewed; không auto publish |
| `scripts/repair-batch*.py`, `repair-*-batch.py` | Source-specific repairs có kiểm tra |
| `scripts/publish-batch*.mjs` | Allowlist + hash + review + duplicate gate riêng batch |
| `scripts/publish-reviewed-lessons.mjs` | Validate bài dist, regenerate catalog A–Z |
| `import/mass-published-*.json` | Chính xác những bài đã đăng từng batch |
| `import/mass-batch-*/source-review.json` | Bằng chứng source pages/corrections/hash |
| `import/source-content-holds.json` | Hard holds cần giữ unpublished |
| `scripts/triage-backlog.py` + `import/backlog-queues/` | Phân loại lịch xử lý; không phải approval |

### Không có giới hạn 7 bài

Giới hạn từng lượt trước do review/nguồn, không phải engine/publisher chỉ nhận7. Có thể chọn nhiều job, chạy6workers, tái dùng OCR/cache; gom bài native sạch riêng, scan riêng, diagram riêng. Không quét lại OCR đã hash-match mỗi lần; không lấy lại ảnh cover sẵn; không đọc toàn bộ lịch sử để thêm một bài.

`convert-batch.py` thử nhiều cached source variants, fingerprint gồm source + parser/code, chạy resumable. OCR đủ ký tự **không chứng minh đủ nội dung**: nhiều trang mất dòng nhưng vẫn dài. Review reading/subtitle/footnote/tasks là nút thắt thật. Chạy batch rộng tạo draft, chỉ publish subset đã kiểm, không giảm quality gates để đạt số lượng.

### Commands điển hình (đọc --help/mã hiện tại trước khi chạy)

```bash
python scripts/bulk-import.py extract --cache <PDF_CACHE> --output <OCR_OUTPUT> --workers 6
python scripts/convert-batch.py --cache <PDF_CACHE> --output <DRAFT_OUTPUT> --workers 6 --prepared import/prepared
python scripts/convert-batch.py --cache <PDF_CACHE> --output <DRAFT_OUTPUT> --workers 6 --native-only
python scripts/triage-backlog.py
node scripts/publish-reviewed-lessons.mjs
node scripts/sync-question-template.mjs
node scripts/check-reviewed-data.mjs
```

- `<...>` là placeholder, không copy nguyên vào shell. Draft/cache/output dùng scratch ngoài `dist`; không làm public scan/OCR rác.
- **Không chạy lại `bulk-import.py inventory` mù quáng**: hàm hiện ghi đè jobs và grouping title, có thể mất progress/ngoại lệ Voynich. Merge trạng thái/source có kiểm soát.
- `DraftBatch.save` của reviewed-ocr ghi review=true theo authoring workflow; chỉ gọi sau khi **thực sự nhìn** toàn bộ source pages, không dùng helper để tự tạo bằng chứng đã review.
- Publish script batch34 tham chiếu source-review + draft SHA + original PDF SHA; giữ pattern cho batch mới, không copy allowlist cũ và sửa review=true hàng loạt.

### Hình dạng lesson JSON (mẫu khung, không phải bài để publish)

```json
{
  "id": "p3-stable-source-specific-id",
  "title": "Exact source title",
  "part": 3,
  "mode": "practice",
  "status": "reviewed",
  "subtitle": "One source subtitle paragraph without hard line breaks",
  "paragraphs": [{"text": "Source paragraph text"}],
  "groups": [],
  "displayParagraphLabels": false,
  "sources": [{"id": "DRIVE_SOURCE_ID", "role": "passage-and-questions", "sha256": "EXACT_HASH"}],
  "conversion": {"version": "3.22", "jobId": "JOB_ID", "sourceParagraphCount": 1},
  "cover": {"asset": "assets/existing-real-photo.jpg", "alt": "Topic", "credit": "Source credit", "source": "Source URL"}
}
```

`groups` phải có thật, đủ 14 câu với range27–40 cho P3; P1 1–13, P2 14–26. Không dùng khung trên vượt validator. Paragraph `heading:true` cho subheading thật, `bullet:true` khi nguồn yêu cầu. Note rows/runs/table/diagram cấu trúc lấy bài đã review, không tự bịa schema. Practice không `key`. Graded bắt buộc accepted/explanation/evidence với quote có thật trong paragraph.

## 14. Quy trình một lượt nhập mới — thực thi từ đầu đến cuối

1. Mở **đúng site**, get_site và source workflow supported. Nếu checkout không có, phục hồi source từ Sites; không tạo website/project khác. Đọc skill Sites hiện hành, không coi đường dẫn plugin cũ là vĩnh viễn.
2. Đọc catalog/jobs/hard holds/new user notes. Xác định bài chưa đăng bằng nội dung/source, không riêng title; đặc biệt Voynich. Chọn native sạch + scan có transcript để review rộng, tách ca khó.
3. Đọc metadata, fetch nguồn qua Drive, đặt cache source-id, lưu hash; dùng prepared hash-match hoặc extract mới. Không upload đáp án vì người dùng đã bỏ yêu cầu cho batch mới.
4. Parse vào draft ngoài dist. Đối chiếu ảnh trang gốc từng bài: title/subtitle, tất cả paragraph và thứ tự hai cột, footnotes, từng task group/word limit/reuse/letters/bank/question numbering.
5. Repair theo nguồn, không lấp phần mờ bằng suy đoán. Dùng canonical sample, schema và shared renderer; source-specific adapter có assertions và provenance.
6. Với diagram: dùng override upload trước, không overwrite bằng PDF crop. Đo canvas, mask/protect arrows, inspect composite; không redrawSVG. Nếu source không đủ thì giữ pending riêng, không block toàn bộ batch khác.
7. Gắn ảnh cover thật phù hợp đã có, metadata source; publish allowlist mới sau review. Không đẩy toàn bộ ready-for-review vì status cấu trúc chưa đủ.
8. Regenerate catalog + template sync; kiểm dữ liệu/controls/instructions phù hợp. Ghi batch manifest, README/source-review, cập nhật jobs; regenerate triage.
9. Kiểm git diff không có credential/cache/source PDF không cần public hay nội dung ngoài nhiệm vụ. Đừng đổi UI khi chỉ nhập bài.
10. Package/save/deploy cùng source commit; đợi status succeeded. Sau đó báo số bài mới/tổng/link. Nếu fail, báo đúng trạng thái, không nói đã đăng.

## 15. Kiểm tra — những bài học từ lỗi đã xảy ra

### Checklist source review bắt buộc

- Đủ reading toàn bộ; không mất dòng cuối cột, paragraph tiếp nối trang, subtitle lẫn body, footer/header/page number rơi vào text.
- Tách đoạn đúng PDF hai cột; ví dụ **An experiment to investigate the nature of language ability** từng tách thiếu đoạn.
- Title/subtitle không giữ hardwrap vô lý; subtitle không thành body. Không nhầm một chữ A đơn lẻ thành subtitle/label.
- Mỗi task: numbering/range không trùng thiếu; bank đủ, option đúng thứ tự; instructions permission chính xác. Không lấy câu hỏi bài khác làm cùng bài.
- Notes giữ bold/italic/underline/bullets/indent; table giữ merge; source limits và paragraph restrictions còn nguyên.
- Footnotes không mất, mỗi mục riêng; không để lại bản footnote lặp trong body.
- Không option letters giấy trên MC/drag; matrix identifiers giữ.
- Drag return/move/cancel, headingexample, selectedcap2/3, groupedquestions, numberedinput placeholder.
- Footer blue border + vạchgreen aligned; hai panes/tablet/zoom không crop.

### Tests có sẵn

```bash
node scripts/check-reviewed-data.mjs
HAPPY_DOM_MODULE=<ABSOLUTE_PATH_TO_happy-dom/lib/index.js> node scripts/tests/batch-practice-dom.mjs import/mass-published-34.json
HAPPY_DOM_MODULE=<ABSOLUTE_PATH_TO_happy-dom/lib/index.js> node scripts/tests/cbt-instructions.mjs
HAPPY_DOM_MODULE=<ABSOLUTE_PATH_TO_happy-dom/lib/index.js> node scripts/tests/full-test-dom.mjs
git diff --check
```

Các test khác tùy change: `footer-state-dom.mjs`, `exam-progress-dom.mjs`, `heading-examples-dom.mjs`, `matching-info-instructions.mjs`, `multiple-answer-dom.mjs`, `footnotes-dom.mjs`, `home-controls-dom.mjs`, `tablet-resize.mjs`, `diagram-dom.mjs`, `flow-chart-dom.mjs`, Python `test_converter.py`, `test_notes.py`, `test_transcript_quality.py`, `test_backlog_triage.py`. Đọc cách gọi từng file; một số cần env/module/path.

Ở phiên trước happy-dom có tại `/workspace/scratch/319b467ab6bd/dom-tests/node_modules/happy-dom/lib/index.js`; scratch có thể bị dọn. Nếu thiếu thì cài đúng dependency theo môi trường và chỉ khi cần. Lỗi cũ chạy cbt-instructions không set HAPPY_DOM_MODULE gây `path undefined`; đó là lỗi cách gọi, không phải bằng chứng controls hỏng.

Batch34: data509, practice56controls, CBT1420groups +12sample/legacy pages và fulltest3frames đã pass. Không cần chạy lại mọi test nếu chỉ viết tài liệu.

**Giới hạn kiểm hình:** phiên trước không có Browser control skill; đã làm source-page inspection, PIL composites và DOM tests, **không có browser screenshot QA**. Không được kể rằng đã nhìn toàn bộ 520 bài trên trình duyệt. Theo Sites managed workflow: nếu `$control-browser` không có thì bỏ browser QA, không tự cài Chromium/Playwright/headless server hay đổi sang browser khác để lách; nêu giới hạn ngắn gọn khi liên quan.

## 16. Lỗi nguồn đã hard-hold — không tự up

Người dùng đã yêu cầu để các bài nguồn sai ở lại. Danh sách chính thức là `import/source-content-holds.json`, được publisher enforce. Chỉ release khi có nguồn sửa rõ ràng và review mới. Không đoán sửa câu hỏi để lách gate.


## 17. Xuất bản qua Sites — không làm mất website hiện tại

Đọc skill Sites hiện hành trong phiên mới. Đây là bản tóm tắt workflow đã dùng, không thay thế schema tool mới:

1. `get_site(project_id)` xác nhận live version/audience. `create_source_repository_write_credential(project_id)` tạo credential mới; không dùng token cũ/hardcode.
2. Source helper theo đường dẫn plugin đã cài. Đường dẫn đã dùng: `/root/.codex/plugins/cache/openai-curated-remote/sites/1.0.1/scripts/site-workflow.mjs` (phiên sau có thể đổi).
3. Chạy helper bằng `exec_command(tty:true, yield_time_ms:1000)` trong checkout với `--project-id` đúng. Đợi “Ready for Site workflow JSON on stdin (input is hidden).” rồi truyền **một JSON newline qua stdin**, không shell arguments/file/log:

```json
{"credential":"RETURNED_CREDENTIAL_OBJECT"}
```

Trong thực tế credential là object tool trả, không chuỗi placeholder ở ví dụ. Giữ toàn bộ opening result làm `source`; helper mở/khôi phục/sync checkout. Trước mutation phải hoàn thành bước mở đúng repo.

4. Sau sửa/test xong, gọi helper lần nữa, stdin:

```json
{"credential":"RETURNED_CREDENTIAL_OBJECT","source":"COMPLETE_OPENING_RESULT_OBJECT","commands":[],"archivePath":"/ABSOLUTE_SCRATCH_PATH/deploy.tar.gz"}
```

`commands` là các argument arrays của checks/build còn cần chạy; dùng [] nếu đã pass với cùng inputs. Helper sở hữu commit/push/package; **không tự git push thủ công**, không tự tạo archive từ state khác.

5. Dùng đúng output `project_id`, `commit_sha`, `archive` → `save_site_version`. Giữ archive không đổi đến khi save thành công. Giữ versionID trả nguyên vẹn.
6. Site hiện public: `deploy_site_version(project_id,version_id)`; không chuyển private/public. Chỉ deploy saved version.
7. `pending/building/publishing` thì poll `get_deployment_status` đúng deploymentID; succeeded + URL là bằng chứng deploy. Không tạo deployment mới để “poll”. Nếu save uncertain, list versions đối chiếu trước retry.
8. Báo URL thật. Không thêm confirmation không cần thiết vì người dùng đã giao up bài; native approvals/tool policy vẫn áp dụng.

`.openai/hosting.json` hiện chỉ khai báo projectID và static dist. Website là static/browser local, không cần database, tài khoản, paid API, external server. Không tạo site mới chỉ vì scratch bị dọn.

**Tài liệu bàn giao này được tạo theo yêu cầu viết Markdown, không sửa code hoặc publish website trong lượt 18/10.**

## 18. Những đối chiếu bài cũ cần nhớ

- **Goya:** subtitle và paragraph letters, Matching Information matrix, Choose TWO width/reference; nguồn thẩm mỹ chính.
- **John Ray:** Matching Headings ô gốc, kéo token trả bank; Choose TWO kỹ hơn mẫu ảnh; không tự làm ô trống “đẹp hơn” nhưng khác máy thi.
- **On the Trail of the Artist(s):** MCQ/matching-info phải đồng bộ, Matching Endings/short-answer sentence wrapper.
- **The Perfume Hunters:** TFNG/instructions, paragraph labels/subtitle left; process text cần scale cùng zoom; Glass bell jar là HTML text.
- **James Hargreaves and the Spinning Jenny:** diagram blank đủ dài, title The Spinning Jenny gần hình vừa phải; arrow/labels giữ nguồn; không ALL CAPS tự ý; TFNG không hai radio; short-answer bỏ ending bank.
- **Are we faced with too much choice:** TFNG và gapfill phải giống mẫu, gaptitle giữa.
- **Avalanches:** title AVALANCHES, input dài, Matching Info **không reuse vì PDF không có**.
- **Australia’s Camouflaged Creatures:** user HTML reference Matching Names; phải up website (người dùng đã sửa yêu cầu nhầm “Drive” thành “website”).
- **Tangle Web Spiders:** matching names cần học Camouflaged Creatures, không dùng template sai.
- **Glassmaking:** note completion không được flatten/mất bold/indent.
- **Pluto Seen up Close:** hai footnotes phải hai paragraph, không nối một dòng.
- **A Digital cinema of the mind:** headingexample nằm trên đoạn, loại khỏi draggable options.
- **Design in the Modern World:** summary drag gap/bank không méo/chồng.
- **An experiment to investigate the nature of language ability:** PDF hai cột cần tách đủ paragraph.
- **Searching for sustainable solutions to indoor air pollution:** flowchart đầu tiên, arrows theo nguồn/upload được chấp nhận.

## 19. Chỗ chưa hoàn tất và cách ưu tiên lượt kế tiếp

1. **Voynich bản thứ hai:** tách source content trước duplicate gate như mục4; không coi việc đã nhắc trong chat là đã sửa implementation.
2. Nhiều bài scan còn cần review/transcription; chuẩn bị transcript chỉ là bước đầu. Tiếp tục batch lớn hơn khi source cho phép, không auto-approve hàng chờ.
3. 9/16 diagram ưu tiên chưa có ảnh upload nét tương đương7bài đã thay; giữ ưu tiên uploaded overrides, không tự báo “refined hoàn toàn đạt yêu cầu”.
4. 14 hardholds giữ lại đến nguồn sửa; queues còn cases mất chữ, mapheading, variants. Không mất công review lại các bài đã source-reviewed nếu không có lý do.
5. Source/title dedup hiện sơ bộ; tổng unique chưa khẳng định. Không dùng tên để xóa bài hoặc ép source variant cùng nội dung khi chưa so.
6. Các ảnh/video cũ tự báo “could not read local image” trong lịch sử không phải asset có thể truy xuất chắc chắn. Repo hiện hành và uploaded copies đã track là điểm phục hồi; thiếu tham chiếu thật cần nói rõ.
7. Tài liệu cũ CONVERTER.md/FULL-TEST.md/README.md ở root được nhắc trong lịch sử nhưng **không tồn tại tại checkout lúc kiểm18/10**. `CONTENT_AUTHORING.md`, `import/README.md`, script và batch artifacts còn. Đừng viện dẫn file thiếu như đã đọc; dùng tài liệu này và source hiện hành.

## 20. Lệnh khởi đầu cho chat mới

Có thể gửi nguyên đoạn sau kèm file này:

> Đọc toàn bộ Markdown bàn giao Tủ Sách IELTS này. Mở đúng Sites project đã ghi, phục hồi và đọc source hiện hành. Giữ nguyên UI hiện tại, các quy tắc sample/instructions/diagram, không thêm đáp án cho batch mới. Kiểm tra jobs/catalog/holds và ghi chú hai bài The Voynich Manuscript khác nhau. Sau đó tiếp tục chuyển và đăng các đề nguồn đầy đủ với số lượng tối đa có thể kiểm chứng trong lượt, dùng bộ chuyển sẵn có, không tự tạo lại website hay bịa nội dung. Chỉ báo đã đăng sau deployment succeeded; báo tên bài, số mới/tổng, link thật. Nếu số liệu mới khác checkpoint520, kiểm tra live/source thay vì ghi đè về checkpoint cũ.

---

# PHỤ LỤC TỰ ĐỘNG TỪ MÃ NGUỒN LÚC BÀN GIAO

Các snapshot dưới đây là bằng chứng/trợ giúp offline. Khi sửa website, đọc file live trong repo; **không dán toàn bộ CSS snapshot vào mỗi HTML**. Không áp CSS nếu state mới đã thay có chủ ý. Tài liệu này không chứa credential hay signed URL.

## A. Các hardhold chính thức (14)

| Passage | Bài | Lý do trong manifest |
|---|---|---|
| 1 | William Gilbert and magnetism | Source paragraph A is copied from Crowding and Density, not William Gilbert; needs corrected source |
| 1 | The Life of Louis Braille | Source notes are headed The characteristics of the camel, unrelated to the Louis Braille content; requires corrected source title. |
| 2 | Digital analysis of literature | source-content: Q20–23 discuss workplaces rather than the passage; compare another version |
| 2 | The power of music | Questions 23–26 concern multitasking and do not match the music passage |
| 2 | Moon Search | Source Questions 21–23 duplicate amateur-astronomer statements from a different passage rather than the Moon Search content; compare an alternate source before publication. |
| 2 | Our Sense of Smell | Heading paragraph mapping is ambiguous |
| 2 | Coins - the first form of money | Heading paragraph mapping is ambiguous |
| 2 | Public art programs: research update | Source Q20–23 concern willpower/self-control experiments, unrelated to the art participation reading; compare alternate corrected source before publication. |
| 2 | Of horses' teeth and regulation | Source Q20 and Q21 have identical prompts; held for source content review |
| 3 | The beginnings of modern cognition | source-content: damaged sentence around symbolic thinking; compare another version |
| 3 | Flower Power | Printed heading range says 27–32 but lists 27–33; hold for source instruction review. |
| 3 | The lost animals of Australia | Printed MCQ range says 27–31 but includes question 32; hold for source instruction review. |
| 3 | REFRACTION | Printed completion range says 36–40 but actual blanks are 33–40; hold for source instruction review. |
| 3 | Sea Change for Salinity | Source Matching Uses Q35 and Q36 both say Radiometric analysis with no distinction; needs source correction, not published |

## B. Hàng chờ chưa reviewed — số job, không phải unique bài

| Nhóm | Tổng | P1 | P2 | P3 |
|---|---:|---:|---:|---:|
| adapter-review | 14 | 8 | 5 | 1 |
| ocr-repair-or-alternate | 58 | 8 | 24 | 26 |
| preflight-needed | 17 | 7 | 3 | 7 |
| published-match-check | 14 | 1 | 8 | 5 |
| source-comparison | 12 | 2 | 9 | 1 |
| source-conflict | 8 | 3 | 4 | 1 |
| transcript-review-candidates | 88 | 27 | 41 | 20 |
| version-comparison | 20 | 1 | 9 | 10 |
| visual-layout | 37 | 30 | 2 | 5 |

Tổng 268. `approved:0` trong metadata triage không có nghĩa toàn bộ website chưa được approve; đây chỉ là hàng chờ.

## C. Danh mục bài đã có trên website


### Passage 1

| Bài | ID hoặc đường dẫn |
|---|---|
| A brief history of ballet | `p1-a-brief-history-of-ballet` |
| A brief history of canned food | `p1-a-brief-history-of-canned-food` |
| A Brief History of Glassmaking | `p1-a-brief-history-of-glassmaking` |
| A brome lives on: how a British grass escaped extinction | `p1-a-brome-lives-on-how-a-british-grass-escaped-extinction` |
| A gem from the sea | `p1-a-gem-from-the-sea` |
| A look at the history of poetry | `p1-a-look-at-the-history-of-poetry` |
| A much-travelled vegetable | `p1-a-much-travelled-vegetable` |
| A river reveals its Roman past | `p1-a-river-reveals-its-roman-past` |
| A survivor's story | `p1-a-survivor-s-story` |
| A watchful eye on bridges | `p1-a-watchful-eye-on-bridges` |
| Advertising needs attention | `p1-advertising-needs-attention` |
| An art exhibition inspired by the age of spices | `p1-an-art-exhibition-inspired-by-the-age-of-spices` |
| An experiment to investigate the nature of language ability | `p1-an-experiment-to-investigate-the-nature-of-language-ability` |
| An important language development | `p1-an-important-language-development` |
| Ancient Greek Coins | `p1-ancient-greek-coins` |
| Ancient Peoples of the Sahara | `p1-ancient-peoples-of-the-sahara` |
| Andrew Carnegie: industrialist and philanthropist | `p1-andrew-carnegie-industrialist-and-philanthropist` |
| Are dreams really meaningful? | `p1-are-dreams-really-meaningful` |
| Are we faced with too much choice? | `bai/are-we-faced-with-too-much-choice.html (legacy HTML)` |
| Australian artist Margaret Preston | `p1-australian-artist-margaret-preston` |
| Australian Rock | `p1-australian-rock` |
| Australia’s Airborne Dentists | `p1-australias-airborne-dentists` |
| Australia’s cane toad problem | `p1-australias-cane-toad-problem` |
| Back to the wild | `p1-back-to-the-wild` |
| Back to their roots | `p1-back-to-their-roots` |
| Barrels | `p1-barrels` |
| Bees and Honey | `p1-bees-and-honey` |
| Bodie: America’s Most Famous Ghost Town | `p1-bodie-americas-most-famous-ghost-town` |
| Bondi | `p1-bondi` |
| Brassicas | `p1-brassicas` |
| Building a New Future | `p1-building-a-new-future` |
| Buried cities of the Amazon Rainforest | `p1-buried-cities-of-the-amazon-rainforest` |
| Candles | `p1-candles` |
| Caral: an ancient South American city | `p1-caral-an-ancient-south-american-city` |
| Charles Dickens' early life in London | `p1-charles-dickens-early-life-in-london` |
| Charles Heaphy and the settlement of New Zealand | `p1-charles-heaphy-and-the-settlement-of-new-zealand` |
| Clarence Birdseye and the Development of Frozen Food | `p1-clarence-birdseye-and-the-development-of-frozen-food` |
| Climate Change and New Diseases | `p1-climate-change-and-new-diseases` |
| Coffee then and now | `p1-coffee-then-and-now` |
| Concrete | `p1-concrete` |
| Conquering the South Pole | `p1-conquering-the-south-pole` |
| Controversies in Australian Prehistory | `p1-controversies-in-australian-prehistory` |
| Cooked Food | `p1-cooked-food` |
| Copy Your Neighbour | `p1-copy-your-neighbour` |
| Development of libraries in Australia | `p1-development-of-libraries-in-australia` |
| Developmental Tasks of Normal Adolescence | `p1-developmental-tasks-of-normal-adolescence` |
| Dirty but Clean Rivers | `p1-dirty-but-clean-rivers` |
| Discovering ancient cities | `p1-discovering-ancient-cities` |
| Dress and its Social Functions | `p1-dress-and-its-social-functions` |
| Dyes and Fabric Dyeing | `p1-dyes-and-fabric-dyeing` |
| El Niño – unusual weather in the Pacific | `p1-el-nino-unusual-weather-in-the-pacific` |
| Energy from the oceans | `p1-energy-from-the-oceans` |
| Faster Trains for China | `p1-faster-trains-for-china` |
| Fazioli pianos | `p1-fazioli-pianos` |
| Flying the Coast | `p1-flying-the-coast` |
| Food flavor | `p1-food-flavor` |
| Food Sources of Early Native Americans | `p1-food-sources-of-early-native-americans` |
| Forty thousand year old baby | `p1-forty-thousand-year-old-baby` |
| Gobekli Tepe: a remarkable discovery | `p1-gobekli-tepe-a-remarkable-discovery` |
| HEALTH IN THE WILD | `p1-health-in-the-wild` |
| Hormones | `p1-hormones` |
| How to be happy | `p1-how-to-be-happy` |
| Ice Ages | `p1-ice-ages` |
| Ice Skating Through History | `p1-ice-skating-through-history` |
| In Deep Water | `p1-in-deep-water` |
| Investing in the Future | `p1-investing-in-the-future` |
| James Hargreaves and the Spinning Jenny | `bai/james-hargreaves-and-the-spinning-jenny.html (legacy HTML)` |
| John St Clair Kilby: inventor of the integrated circuit | `p1-john-st-clair-kilby-inventor-of-the-integrated-circuit` |
| Koalas | `p1-koalas` |
| Learning by example: evidence from studies of rats and birds | `p1-learning-by-example-evidence-from-studies-of-rats-and-birds` |
| Lichens | `p1-lichens` |
| Living with uncertainty | `p1-living-with-uncertainty` |
| Looking Skyward | `p1-looking-skyward` |
| Map-reading and Gender | `p1-map-reading-and-gender` |
| Mental Gymnastic | `p1-mental-gymnastic` |
| Motivating employees who work with customers | `p1-motivating-employees-who-work-with-customers` |
| Mystery Drawing | `p1-mystery-drawing` |
| Māori buildings in New Zealand | `p1-maori-buildings-in-new-zealand` |
| New Understanding of Giraffes in the Wild | `p1-new-understanding-of-giraffes-in-the-wild` |
| Obesity: Do citizens of developed countries really have a choice? | `p1-obesity-do-citizens-of-developed-countries-really-have-a-choice` |
| Otters | `p1-otters` |
| Pluto Seen up Close for the First Time | `p1-pluto-seen-up-close-for-the-first-time` |
| Practical Action | `p1-practical-action` |
| Preserving the Gardens of the Past | `p1-preserving-the-gardens-of-the-past` |
| Rags to Riches | `p1-rags-to-riches` |
| Review of research on the effects of food promotion to children | `p1-review-of-research-on-the-effects-of-food-promotion-to-children` |
| Rubber | `p1-rubber` |
| Saving the date palm | `p1-saving-the-date-palm` |
| Saving the kiwi | `p1-saving-the-kiwi` |
| Searching for sustainable solutions to indoor air pollution | `p1-searching-for-sustainable-solutions-to-indoor-air-pollution` |
| Seaweed | `p1-seaweed` |
| Secrets of the Nasca Lines | `p1-secrets-of-the-nasca-lines` |
| Shopping by design | `p1-shopping-by-design` |
| Sleep Study on Modern-Day Hunter-Gatherers Dispels Popular Notions | `p1-sleep-study-on-modern-day-hunter-gatherers-dispels-popular-notions` |
| Socotra Island | `p1-socotra-island` |
| Steam across the water | `p1-steam-across-the-water` |
| Studies in the History of Art and Visual Culture | `p1-studies-in-the-history-of-art-and-visual-culture` |
| Successful approaches to public speaking | `p1-successful-approaches-to-public-speaking` |
| Supplying drinking water to Australian households | `p1-supplying-drinking-water-to-australian-households` |
| Sweet scent of success | `p1-sweet-scent-of-success` |
| Sweet Trouble | `p1-sweet-trouble` |
| Sydney Opera House | `p1-sydney-opera-house` |
| TEMPERATURE RISING | `p1-temperature-rising` |
| The adaptation of Dickens' novels for film | `p1-the-adaptation-of-dickens-novels-for-film` |
| The Band of Holes | `p1-the-band-of-holes` |
| The Baobabs of Madagascar | `p1-the-baobabs-of-madagascar` |
| The Burgess Shale fossils | `p1-the-burgess-shale-fossils` |
| The chemical element phosphorus | `p1-the-chemical-element-phosphorus` |
| The Cooling Effect of Plastic Clothes | `p1-the-cooling-effect-of-plastic-clothes` |
| The Development of Exploration and Scientific Research in Antarctica | `p1-the-development-of-exploration-and-scientific-research-in-antarctica` |
| The Development of Italian Opera | `p1-the-development-of-italian-opera` |
| The Development of Research Stations in Antarctica | `p1-the-development-of-research-stations-in-antarctica` |
| The Development of the Advertising Industry in New Zealand | `p1-the-development-of-the-advertising-industry-in-new-zealand` |
| The disappearance of the thylacine | `p1-the-disappearance-of-the-thylacine` |
| The Dunedin Study | `p1-the-dunedin-study` |
| The early days of oil production | `p1-the-early-days-of-oil-production` |
| The English canal system | `p1-the-english-canal-system` |
| The explorations of Matthew Flinders | `p1-the-explorations-of-matthew-flinders` |
| The extinction of the cave bear | `p1-the-extinction-of-the-cave-bear` |
| The Great Exhibition | `p1-the-great-exhibition` |
| The history of cakes at weddings | `p1-the-history-of-cakes-at-weddings` |
| The history of colours and the meanings people have given them | `p1-the-history-of-colours-and-the-meanings-people-have-given-them` |
| The history of farming | `p1-the-history-of-farming` |
| The history of lighting | `p1-the-history-of-lighting` |
| The history of London's coffeehouses | `p1-the-history-of-london-s-coffeehouses` |
| The history of the car industry | `p1-the-history-of-the-car-industry` |
| The History of the Doughnut | `p1-the-history-of-the-doughnut` |
| The history of the guitar | `p1-the-history-of-the-guitar` |
| The history of the picnic | `p1-the-history-of-the-picnic` |
| The history of theater designs in Britain | `p1-the-history-of-theater-designs-in-britain` |
| The history of walking in New Zealand | `p1-the-history-of-walking-in-new-zealand` |
| The Impact of Refrigeration | `p1-the-impact-of-refrigeration` |
| The Importance of Business Cards | `p1-the-importance-of-business-cards` |
| The kea | `p1-the-kea` |
| The life of Beatrix Potter | `p1-the-life-of-beatrix-potter` |
| The Long History of Chocolate | `p1-the-long-history-of-chocolate` |
| The Mesoamerican Ball Game | `p1-the-mesoamerican-ball-game` |
| The Olmec and their great stone heads | `p1-the-olmec-and-their-great-stone-heads` |
| The Olympic Torch | `p1-the-olympic-torch` |
| The origins of cinema | `p1-the-origins-of-cinema` |
| The origins of mathematics | `p1-the-origins-of-mathematics` |
| The origins of rodeo: a competitive sport | `p1-the-origins-of-rodeo-a-competitive-sport` |
| The origins of tennis | `p1-the-origins-of-tennis` |
| The Origins of Weather Forecasting | `p1-the-origins-of-weather-forecasting` |
| The Pixar Story | `p1-the-pixar-story` |
| The Pyramid of Cestius | `p1-the-pyramid-of-cestius` |
| The search for an alternative to plastic | `p1-the-search-for-an-alternative-to-plastic` |
| The secret of a long life | `p1-the-secret-of-a-long-life` |
| The Slow Food Organization | `p1-the-slow-food-organization` |
| The Southern Cross | `p1-the-southern-cross` |
| The story of the railroad | `p1-the-story-of-the-railroad` |
| The Sunlight Soap Story | `p1-the-sunlight-soap-story` |
| The Travelling Stock Routes and Reserves of New South Wales | `p1-the-travelling-stock-routes-and-reserves-of-new-south-wales` |
| The treadle pump | `p1-the-treadle-pump` |
| The Treasures of Sutton Hoo | `p1-the-treasures-of-sutton-hoo` |
| The Tyne Bridge | `p1-the-tyne-bridge` |
| The unsung sense | `p1-the-unsung-sense` |
| The Whale Goes to Court | `p1-the-whale-goes-to-court` |
| The world’s first cities | `p1-the-worlds-first-cities` |
| Think Small | `p1-think-small` |
| Tikopia | `p1-tikopia` |
| Traditional Maori Fish Hooks | `p1-traditional-maori-fish-hooks` |
| Traditional Māori Medicine | `p1-traditional-maori-medicine` |
| Traditional Pearl Diving Practices off the Coast of Bahrain | `p1-traditional-pearl-diving-practices-off-the-coast-of-bahrain` |
| Transport and transport systems during the Roman Empire | `p1-transport-and-transport-systems-during-the-roman-empire` |
| Tunnelling under the Thames | `p1-tunnelling-under-the-thames` |
| Tyrannosaur Rex: A New Theory | `p1-tyrannosaur-rex-a-new-theory` |
| Under the skin of a great violin | `p1-under-the-skin-of-a-great-violin` |
| Undergraduate students: Guidelines to students on literature courses | `p1-undergraduate-students-guidelines-to-students-on-literature-courses` |
| Using Up Our Oceans' Resources | `p1-using-up-our-oceans-resources` |
| Using video diaries to collect research data from children | `p1-using-video-diaries-to-collect-research-data-from-children` |
| Vulcan, the planet that wasn’t there | `p1-vulcan-the-planet-that-wasnt-there` |
| Weaver ants – a remarkable species | `p1-weaver-ants-a-remarkable-species` |
| What do managers really do? | `p1-what-do-managers-really-do` |
| What have we learned from the new Viking ship? | `p1-what-have-we-learned-from-the-new-viking-ship` |
| What is the secret of a long life? | `p1-what-is-the-secret-of-a-long-life` |
| When Maps were Made for the Public | `p1-when-maps-were-made-for-the-public` |
| Windmills | `p1-windmills` |
| Work and Family – A Balancing Act | `p1-work-and-family-a-balancing-act` |

### Passage 2

| Bài | ID hoặc đường dẫn |
|---|---|
| A Guide to Healthy Eating | `p2-a-guide-to-healthy-eating` |
| A mechanical friend for children | `p2-a-mechanical-friend-for-children` |
| A new way of reading | `p2-a-new-way-of-reading` |
| A report on the state of the music market – 2007 | `p2-a-report-on-the-state-of-the-music-market-2007` |
| A threat to salmon farming | `p2-a-threat-to-salmon-farming` |
| A unique golden textile | `p2-a-unique-golden-textile` |
| Adventures in Comic-Land | `p2-adventures-in-comic-land` |
| American businesses aim to support employees and their families | `p2-american-businesses-aim-to-support-employees-and-their-families` |
| An ancient city | `p2-an-ancient-city` |
| An Australian Tree Abroad | `p2-an-australian-tree-abroad` |
| An early study of inappropriate behaviour in the classroom | `p2-an-early-study-of-inappropriate-behaviour-in-the-classroom` |
| An Innovative American School: Black Mountain College | `p2-an-innovative-american-school-black-mountain-college` |
| Ancient Treasures | `p2-ancient-treasures` |
| Antarctic architecture: Halley VI | `p2-antarctic-architecture-halley-vi` |
| Antarctica's climate | `p2-antarctica-s-climate` |
| Arctic foxes | `p2-arctic-foxes` |
| Are the rules of grammar inherited or learned? | `p2-are-the-rules-of-grammar-inherited-or-learned` |
| Athletes and diet | `p2-athletes-and-diet` |
| Australia's Camouflaged Creatures | `bai/australias-camouflaged-creatures.html (legacy HTML)` |
| Australian Society Before European Settlement | `p2-australian-society-before-european-settlement` |
| Australian Sports Guidelines | `p2-australian-sports-guidelines` |
| Babies cry in their mother tongue | `p2-babies-cry-in-their-mother-tongue` |
| Being left-handed in a right-handed world | `p2-being-left-handed-in-a-right-handed-world` |
| Bird Migration | `p2-bird-migration` |
| Birds in the City | `p2-birds-in-the-city` |
| Book Review | `p2-book-review` |
| Books and Buildings | `p2-books-and-buildings` |
| Brains trust: learning about ourselves | `p2-brains-trust-learning-about-ourselves` |
| Bravery and Courage | `p2-bravery-and-courage` |
| Capability Brown | `p2-capability-brown` |
| Catch of the Day | `p2-catch-of-the-day` |
| Children's understanding of other people's minds | `p2-children-s-understanding-of-other-people-s-minds` |
| Children’s literature | `p2-childrens-literature` |
| Conserving plastic | `p2-conserving-plastic` |
| Corporate social responsibility | `p2-corporate-social-responsibility` |
| Creative Problem-Solving | `p2-creative-problem-solving` |
| Creator of Managers | `p2-creator-of-managers` |
| De-extinction | `p2-de-extinction` |
| Decision Fatigue | `p2-decision-fatigue` |
| Defining Street Art | `p2-defining-street-art` |
| Doodling | `p2-doodling` |
| Ecotherapy: Using nature to treat health | `p2-ecotherapy-using-nature-to-treat-health` |
| Effects of changes in world population | `p2-effects-of-changes-in-world-population` |
| Emotional development in babies | `p2-emotional-development-in-babies` |
| Europe’s earliest artists | `p2-europes-earliest-artists` |
| Fragrant memories | `p2-fragrant-memories` |
| Gamma Gardening | `p2-gamma-gardening` |
| Geodiversity | `p2-geodiversity` |
| Getting Young Children to Stay in Bed and Sleep | `p2-getting-young-children-to-stay-in-bed-and-sleep` |
| GOING WITH THE FLOW? | `p2-going-with-the-flow` |
| Goya’s Portraits | `bai/ielts_p2_goya.html (legacy HTML)` |
| Growing food in cities | `p2-growing-food-in-cities` |
| Healthy buildings, productive people | `p2-healthy-buildings-productive-people` |
| Heart of the Community | `p2-heart-of-the-community` |
| Herbal Medicines | `p2-herbal-medicines` |
| Homo ergaster | `p2-homo-ergaster` |
| How Dental Health Is Threatened | `p2-how-dental-health-is-threatened` |
| How deserts are formed | `p2-how-deserts-are-formed` |
| How do plants talk to each other? | `p2-how-do-plants-talk-to-each-other` |
| How sleep helps us learn | `p2-how-sleep-helps-us-learn` |
| How the Petri dish supports scientific advances | `p2-how-the-petri-dish-supports-scientific-advances` |
| How well do people concentrate? | `p2-how-well-do-people-concentrate` |
| Human running speed | `p2-human-running-speed` |
| Ideal Homes | `p2-ideal-homes` |
| Improving sensory perception | `p2-improving-sensory-perception` |
| Insect Decision-Making | `p2-insect-decision-making` |
| Introduction to a book about the assessment of carbon footprints | `p2-introduction-to-a-book-about-the-assessment-of-carbon-footprints` |
| Japanese Bizen: Art that Rose from the Ashes | `p2-japanese-bizen-art-that-rose-from-the-ashes` |
| Jellyfish – The Dominant Species | `p2-jellyfish-the-dominant-species` |
| John Ray and the Study of Plants | `bai/john_ray_study_of_plants_matching_headings.html (legacy HTML)` |
| Keeping an eye on shoppers | `p2-keeping-an-eye-on-shoppers` |
| Keeping the water away | `p2-keeping-the-water-away` |
| Lake Bosumtwi – the secrets of a crater lake | `p2-lake-bosumtwi-the-secrets-of-a-crater-lake` |
| Learning from the Romans | `p2-learning-from-the-romans` |
| Learning to sing | `p2-learning-to-sing` |
| Libraries | `p2-libraries` |
| London Smog | `p2-london-smog` |
| Magnificent money-making mantas | `p2-magnificent-money-making-mantas` |
| Making images from space more accessible | `p2-making-images-from-space-more-accessible` |
| Measuring economic activity from outer space | `p2-measuring-economic-activity-from-outer-space` |
| Meeting Challenges in Food Production | `p2-meeting-challenges-in-food-production` |
| Memory in plants | `p2-memory-in-plants` |
| Methods of increasing fish production | `p2-methods-of-increasing-fish-production` |
| Michael Ventris and the decoding of Linear B | `p2-michael-ventris-and-the-decoding-of-linear-b` |
| Mimicry and parenting | `p2-mimicry-and-parenting` |
| Mind Music | `p2-mind-music` |
| Mixed signals | `p2-mixed-signals` |
| Multi-tasking and the brain | `p2-multi-tasking-and-the-brain` |
| Muscle Wasting | `p2-muscle-wasting` |
| Music and the human brain | `p2-music-and-the-human-brain` |
| New Businesses in New Zealand | `p2-new-businesses-in-new-zealand` |
| New Technology in New Zealand’s Health Service | `p2-new-technology-in-new-zealands-health-service` |
| Newly hatched birds | `p2-newly-hatched-birds` |
| Office Design | `p2-office-design` |
| On the Trail of the Artist | `bai/ielts_p2_trail_artist.html (legacy HTML)` |
| Orchids | `p2-orchids` |
| Parental involvement programmes in education: a review of the literature | `p2-parental-involvement-programmes-in-education-a-review-of-the-literature` |
| Patience, fairness and the human condition | `p2-patience-fairness-and-the-human-condition` |
| Playing soccer | `p2-playing-soccer` |
| Preserving Antarctic History | `p2-preserving-antarctic-history` |
| Re-dating cave art | `p2-re-dating-cave-art` |
| Reading in different media | `p2-reading-in-different-media` |
| Red and Brown Seaweed | `p2-red-and-brown-seaweed` |
| Restoring Neighborhoods by Removing Highways | `p2-restoring-neighborhoods-by-removing-highways` |
| Rocket Science | `p2-rocket-science` |
| Roller coaster: the great fairground attraction | `p2-roller-coaster-the-great-fairground-attraction` |
| Saving the SS United States | `p2-saving-the-ss-united-states` |
| Seeing in the Sea | `bai/seeing_in_the_sea_ielts.html (legacy HTML)` |
| Should we stop eating meat? | `p2-should-we-stop-eating-meat` |
| Sleep – who needs it | `p2-sleep-who-needs-it` |
| Solving the problem of waste disposal | `p2-solving-the-problem-of-waste-disposal` |
| Storytelling, from prehistoric caves to modern cinemas | `p2-storytelling-from-prehistoric-caves-to-modern-cinemas` |
| Stress less | `p2-stress-less` |
| Surviving the winter: hibernation and other resting states | `p2-surviving-the-winter-hibernation-and-other-resting-states` |
| Sydney’s Road Stories | `p2-sydneys-road-stories` |
| Teamwork | `p2-teamwork` |
| Technology and the Future Workforce in the US | `p2-technology-and-the-future-workforce-in-the-us` |
| The biological basis of business management | `p2-the-biological-basis-of-business-management` |
| The Changing Face of Farming in the Canterbury Region of New Zealand | `p2-the-changing-face-of-farming-in-the-canterbury-region-of-new-zealand` |
| The clustering of IT companies | `p2-the-clustering-of-it-companies` |
| The collective evolution of tangle-web spiders | `p2-the-collective-evolution-of-tangle-web-spiders` |
| The Commercial Production of Ice in the Nineteenth Century | `p2-the-commercial-production-of-ice-in-the-nineteenth-century` |
| The conquest of malaria in Italy | `p2-the-conquest-of-malaria-in-italy` |
| The cost of human thinking ability | `p2-the-cost-of-human-thinking-ability` |
| The development of humour in children | `p2-the-development-of-humour-in-children` |
| The Discovery of Gobekli Tepe | `p2-the-discovery-of-gobekli-tepe` |
| The fascinating world of attine ants | `p2-the-fascinating-world-of-attine-ants` |
| The fashion industry | `p2-the-fashion-industry` |
| The Future of Fabrics and Fibres | `p2-the-future-of-fabrics-and-fibres` |
| The Future of Food Packaging | `p2-the-future-of-food-packaging` |
| The gender gap in New Zealand’s high school examination results | `p2-the-gender-gap-in-new-zealands-high-school-examination-results` |
| The Greener Side of Biotechnology | `p2-the-greener-side-of-biotechnology` |
| The History of Men's Leisurewear | `p2-the-history-of-men-s-leisurewear` |
| The history of tapestry in Europe | `p2-the-history-of-tapestry-in-europe` |
| The history of the Celtic language | `p2-the-history-of-the-celtic-language` |
| The humble houseplant: an aid for health and cleanliness | `p2-the-humble-houseplant-an-aid-for-health-and-cleanliness` |
| The Impact of Sports Tourism on Urban Areas | `p2-the-impact-of-sports-tourism-on-urban-areas` |
| The importance of being playful | `p2-the-importance-of-being-playful` |
| The importance of diet | `p2-the-importance-of-diet` |
| The internal body clock | `p2-the-internal-body-clock` |
| The international meteorite market | `p2-the-international-meteorite-market` |
| The last of the rock forests | `p2-the-last-of-the-rock-forests` |
| The Link between Culture and Thought | `p2-the-link-between-culture-and-thought` |
| The longest conservation fence in the world | `p2-the-longest-conservation-fence-in-the-world` |
| The Mbuti of the Ituri Forest in Zaire | `p2-the-mbuti-of-the-ituri-forest-in-zaire` |
| The Myth of the Eight-hour Sleep | `p2-the-myth-of-the-eight-hour-sleep` |
| The nature of yawning | `p2-the-nature-of-yawning` |
| The older, the wiser | `p2-the-older-the-wiser` |
| The origin and development of applause | `p2-the-origin-and-development-of-applause` |
| The origins of Scottish brochs | `p2-the-origins-of-scottish-brochs` |
| The Perfume Hunters | `bai/the-perfume-hunters.html (legacy HTML)` |
| The placebo effect | `p2-the-placebo-effect` |
| The plan to bring an asteroid to Earth | `p2-the-plan-to-bring-an-asteroid-to-earth` |
| The Power of Smell | `p2-the-power-of-smell` |
| The problem of graffiti | `p2-the-problem-of-graffiti` |
| The problem of waste in the 21st century | `p2-the-problem-of-waste-in-the-21st-century` |
| The Rebirth of the Circus | `p2-the-rebirth-of-the-circus` |
| The return of monkey life | `p2-the-return-of-monkey-life` |
| The return of the black-footed ferret | `p2-the-return-of-the-black-footed-ferret` |
| The Role of Mothers in the Origins of Music | `p2-the-role-of-mothers-in-the-origins-of-music` |
| The Use of Dietary Supplements | `p2-the-use-of-dietary-supplements` |
| Treasures of the deep | `p2-treasures-of-the-deep` |
| Treetop Research | `p2-treetop-research` |
| Two of a kind – scientific research into twins | `p2-two-of-a-kind-scientific-research-into-twins` |
| Undoing our emotions | `p2-undoing-our-emotions` |
| Viking Ireland | `p2-viking-ireland` |
| Walking and Shoes in Eighteenth-Century London | `p2-walking-and-shoes-in-eighteenth-century-london` |
| War of the Plants | `p2-war-of-the-plants` |
| Weighty matters | `p2-weighty-matters` |
| What does performance involve? | `p2-what-does-performance-involve` |
| When our immune system works against us | `p2-when-our-immune-system-works-against-us` |
| Who wrote Shakespeare's plays? | `p2-who-wrote-shakespeare-s-plays` |
| Why do we use language? | `p2-why-do-we-use-language` |
| Why don't we sleep? | `p2-why-don-t-we-sleep` |
| Why was he so smart? | `p2-why-was-he-so-smart` |
| Why We Can’t Trust Maps? | `p2-why-we-cant-trust-maps` |
| Why we love music? | `p2-why-we-love-music` |

### Passage 3

| Bài | ID hoặc đường dẫn |
|---|---|
| A closer examination of a study on verbal and non-verbal messages | `p3-a-closer-examination-of-a-study-on-verbal-and-non-verbal-messages` |
| A Digital Cinema of the Mind? | `p3-a-digital-cinema-of-the-mind` |
| A history of pirates | `p3-a-history-of-pirates` |
| A most unusual theatre | `p3-a-most-unusual-theatre` |
| A New Voyage Round the World | `p3-a-new-voyage-round-the-world` |
| A review of Mimi Sheraton's book, 1,000 Foods To Eat Before you Die | `p3-a-review-of-mimi-sheraton-s-book-1-000-foods-to-eat-before-you-die` |
| All in the family | `p3-all-in-the-family` |
| An introduction to a new collection of Ted Hughes’s* poems | `p3-an-introduction-to-a-new-collection-of-ted-hughes-s-poems` |
| Ancient Rome: archaeologists are trying to understand more about the early history of the city | `p3-ancient-rome-archaeologists-are-trying-to-understand-more-about-the-early-history-of-the-city` |
| Animals predicting earthquakes? | `p3-animals-predicting-earthquakes` |
| Architecture in Britain | `p3-architecture-in-britain` |
| Art-based training for engineers | `p3-art-based-training-for-engineers` |
| Australia’s Megafauna Controversy | `p3-australias-megafauna-controversy` |
| AVALANCHES | `bai/avalanches.html (legacy HTML)` |
| Beauty | `p3-beauty` |
| Being Unique | `p3-being-unique` |
| Book Review: Architecture in the United States | `p3-book-review-architecture-in-the-united-states` |
| Brain Makeover | `p3-brain-makeover` |
| Bright sparks | `p3-bright-sparks` |
| Can business learn from computer games? | `p3-can-business-learn-from-computer-games` |
| Can hurricanes be moderated or diverted? | `p3-can-hurricanes-be-moderated-or-diverted` |
| Changes to the Soviet Union's working week | `p3-changes-to-the-soviet-union-s-working-week` |
| Children and Symbols | `p3-children-and-symbols` |
| Children's literature studies today | `p3-children-s-literature-studies-today` |
| Child’s Play in Medieval England | `p3-childs-play-in-medieval-england` |
| Conformity | `p3-conformity` |
| Creating a Better Grapefruit | `p3-creating-a-better-grapefruit` |
| Crossing the Threshold | `p3-crossing-the-threshold` |
| Decisions, decisions! | `p3-decisions-decisions` |
| Design in the modern world | `p3-design-in-the-modern-world` |
| Disappearing Languages | `p3-disappearing-languages` |
| Does Class Size Matter? | `p3-does-class-size-matter` |
| Expansion of the world’s deserts | `p3-expansion-of-the-worlds-deserts` |
| Facial Expressions | `p3-facial-expressions` |
| Fruits of the Forest | `p3-fruits-of-the-forest` |
| Game theory | `p3-game-theory` |
| Global warming in New Zealand | `p3-global-warming-in-new-zealand` |
| Graffiti in New York City | `p3-graffiti-in-new-york-city` |
| Green Fingers and Green Thoughts | `bai/green_fingers_and_green_thoughts_ielts.html (legacy HTML)` |
| How can we make good decisions? | `p3-how-can-we-make-good-decisions` |
| How did music begin? | `p3-how-did-music-begin` |
| How scientists see science | `p3-how-scientists-see-science` |
| How should reading be taught? | `p3-how-should-reading-be-taught` |
| How to clean a beach | `p3-how-to-clean-a-beach` |
| How to win the World Memory Championship | `p3-how-to-win-the-world-memory-championship` |
| Humanities and the health professional | `p3-humanities-and-the-health-professional` |
| Images and Places | `p3-images-and-places` |
| Improving nutrition at a national and international level | `p3-improving-nutrition-at-a-national-and-international-level` |
| Insect-inspired robots | `p3-insect-inspired-robots` |
| Intelligence | `p3-intelligence` |
| Is Teleworking Sustainable? | `p3-is-teleworking-sustainable` |
| Is there such a thing as too much information? | `p3-is-there-such-a-thing-as-too-much-information` |
| Lawrence Johnston and Hidcote Garden | `p3-lawrence-johnston-and-hidcote-garden` |
| Learning to be bilingual | `p3-learning-to-be-bilingual` |
| Leatherback Turtles | `p3-leatherback-turtles` |
| Leo Burnett 1891–1971 | `p3-leo-burnett-18911971` |
| Let’s all be friends | `p3-lets-all-be-friends` |
| Linguistic Diversity | `p3-linguistic-diversity` |
| Literacy and Rural Communities in Australia | `p3-literacy-and-rural-communities-in-australia` |
| Living outside the box | `p3-living-outside-the-box` |
| Look who was talking | `p3-look-who-was-talking` |
| Looking at daily life in ancient Rome | `p3-looking-at-daily-life-in-ancient-rome` |
| Looking for inspiration | `p3-looking-for-inspiration` |
| Making Your Mind Up | `p3-making-your-mind-up` |
| Manage Your Energy, Not Your Time | `p3-manage-your-energy-not-your-time` |
| Marine diversity | `p3-marine-diversity` |
| Marine mammals exhibit their ingenuity | `p3-marine-mammals-exhibit-their-ingenuity` |
| Mark Strizic: the career of an Australian photographer | `p3-mark-strizic-the-career-of-an-australian-photographer` |
| Mark Sumner of the University of Leeds explains the challenges facing the fashion industry | `p3-mark-sumner-of-the-university-of-leeds-explains-the-challenges-facing-the-fashion-industry` |
| Marketing environmentally-friendly products | `p3-marketing-environmentally-friendly-products` |
| MERCATOR – THE MAP MAKER | `p3-mercator-the-map-maker` |
| Mobile technology and language | `p3-mobile-technology-and-language` |
| Movement Underwater | `p3-movement-underwater` |
| Multi-purpose meeting spaces | `p3-multi-purpose-meeting-spaces` |
| Multitasking | `p3-multitasking` |
| New Insights into Keeping Our Brains Agile with Age | `p3-new-insights-into-keeping-our-brains-agile-with-age` |
| New Zealand Short Stories | `p3-new-zealand-short-stories` |
| No title – Charles Darwin | `p3-no-title-charles-darwin` |
| No title – Mirrors | `p3-psychological-responses-to-mirror-images` |
| On art and artists | `p3-on-art-and-artists` |
| Patterns of Nature | `p3-patterns-of-nature` |
| Personality and Appearance | `p3-personality-and-appearance` |
| Petrol power: an eco-revolution? | `p3-petrol-power-an-eco-revolution` |
| Planets without suns | `p3-planets-without-suns` |
| Power from the Sea | `p3-power-from-the-sea` |
| Putting the parts together: muskets and mass production | `p3-putting-the-parts-together-muskets-and-mass-production` |
| Reading Greek | `p3-reading-greek` |
| Rebranding art museums | `p3-rebranding-art-museums` |
| Reducing exposure to indoor air pollution in developing countries | `p3-reducing-exposure-to-indoor-air-pollution-in-developing-countries` |
| Relish the flavour | `p3-relish-the-flavour` |
| Research into the effects of different teaching styles | `p3-research-into-the-effects-of-different-teaching-styles` |
| Rights for apes | `p3-rights-for-apes` |
| Robert Louis Stevenson | `p3-robert-louis-stevenson` |
| Roll Cameras! | `p3-roll-cameras` |
| San Francisco Museum of Modern Art | `p3-san-francisco-museum-of-modern-art` |
| Saving languages | `p3-saving-languages` |
| Science and filmmaking | `p3-science-and-filmmaking` |
| Seeing the colour of sounds, hearing the colour of numbers | `p3-seeing-the-colour-of-sounds-hearing-the-colour-of-numbers` |
| Self-perceptions | `p3-self-perceptions` |
| Sign, baby, sign! | `p3-sign-baby-sign` |
| Sir Francis Ronalds 1788 – 1873 | `p3-sir-francis-ronalds-1788-1873` |
| Songs of Ourselves | `p3-songs-of-ourselves` |
| Speech acts and philosophy | `p3-speech-acts-and-philosophy` |
| Star Performers | `p3-star-performers` |
| Strategies for helping children to learn | `p3-strategies-for-helping-children-to-learn` |
| Studying the history of medieval Britain | `p3-studying-the-history-of-medieval-britain` |
| Take Back Your Time | `p3-take-back-your-time` |
| Tasmania's Museum of Old and New Art | `p3-tasmania-s-museum-of-old-and-new-art` |
| Termite Mounds | `p3-termite-mounds` |
| The ability to communicate using language | `p3-the-ability-to-communicate-using-language` |
| The Accidental Scientist | `p3-the-accidental-scientist` |
| The Analysis of Fear | `p3-the-analysis-of-fear` |
| The Animal Connection | `p3-the-animal-connection` |
| The Antikythera Mechanism | `p3-the-antikythera-mechanism` |
| The booming business of nation-branding | `p3-the-booming-business-of-nation-branding` |
| The Cause of Linguistic Change | `p3-the-cause-of-linguistic-change` |
| The contentious role of public art | `p3-the-contentious-role-of-public-art` |
| The controversy about the origins of money – did it really originate from bartering? | `p3-the-controversy-about-the-origins-of-money-did-it-really-originate-from-bartering` |
| The cost of brand loyalty | `p3-the-cost-of-brand-loyalty` |
| The dark side of the technological boom | `p3-the-dark-side-of-the-technological-boom` |
| The effectiveness of an online course | `p3-the-effectiveness-of-an-online-course` |
| The fortunes of human societies | `p3-the-fortunes-of-human-societies` |
| The future of work | `p3-the-future-of-work` |
| The geography of taste buds | `p3-the-geography-of-taste-buds` |
| The hazards of multitasking | `p3-the-hazards-of-multitasking` |
| The Intuitive Geologists | `p3-the-intuitive-geologists` |
| The Long Road to Artificial Intelligence | `p3-the-long-road-to-artificial-intelligence` |
| The long view | `p3-the-long-view` |
| The mystery of Easter Island | `p3-the-mystery-of-easter-island` |
| The New Zealand writer Margaret Mahy | `p3-the-new-zealand-writer-margaret-mahy` |
| The origin of language | `p3-the-origin-of-language` |
| The Pirahã people of Brazil | `p3-the-piraha-people-of-brazil` |
| The process of invention | `p3-the-process-of-invention` |
| The psychology of new product adoption | `p3-the-psychology-of-new-product-adoption` |
| The rise of big data | `p3-the-rise-of-big-data` |
| The role of accidents in business | `p3-the-role-of-accidents-in-business` |
| The science of sleep | `p3-the-science-of-sleep` |
| The secret sounds of elephants | `p3-the-secret-sounds-of-elephants` |
| The sound recording industry in the USA before 1950 | `p3-the-sound-recording-industry-in-the-usa-before-1950` |
| The strange world of sight | `p3-the-strange-world-of-sight` |
| The Study of Dreams | `p3-the-study-of-dreams` |
| The survival of the luxury Swiss watchmaking business | `p3-the-survival-of-the-luxury-swiss-watchmaking-business` |
| The value of literary prizes | `p3-the-value-of-literary-prizes` |
| The Value of Self-esteem | `p3-the-value-of-self-esteem` |
| The Voynich Manuscript | `p3-the-voynich-manuscript` |
| The watercraft of the world | `p3-the-watercraft-of-the-world` |
| The wooden huts of Antarctica | `p3-the-wooden-huts-of-antarctica` |
| Theory or practice? | `p3-theory-or-practice` |
| There's no place like home | `p3-there-s-no-place-like-home` |
| Tick Tock Body Clock | `bai/ielts_p3_body_clock.html (legacy HTML)` |
| Toscanini's pursuit of perfection | `p3-toscanini-s-pursuit-of-perfection` |
| Translating: a key to international understanding? | `p3-translating-a-key-to-international-understanding` |
| Travel writing | `p3-travel-writing` |
| Travelling Plants | `p3-travelling-plants` |
| Understanding symbols | `p3-understanding-symbols` |
| WHALE CULTURE | `p3-whale-culture` |
| What count as knowledge? | `p3-what-count-as-knowledge` |
| What is social history? | `p3-what-is-social-history` |
| What makes us human? | `p3-what-makes-us-human` |
| What makes you happy? | `p3-what-makes-you-happy` |
| Who looks after the children in today’s Britain? | `p3-who-looks-after-the-children-in-todays-britain` |
| Why good food tastes good? | `p3-why-good-food-tastes-good` |
| Why Societies Collapse | `p3-why-societies-collapse` |
| Youth homelessness | `p3-youth-homelessness` |

## D. Danh sách job chưa reviewed (để tra, chưa được phép auto-publish)

Có thể trùng nội dung hoặc khác bản với bài đã đăng. Flags, sources, hashes, details phải mở `import/jobs.json` và queue JSON tương ứng.

| Passage | Job ID | Title | Nhóm triage |
|---|---|---|---|
| 1 | `p1-a-moment-of-perfection-chua-go` | A Moment of Perfection(CHƯA GÕ) | visual-layout |
| 1 | `p1-a-watchful-eye-on-bridges` | A watchful eye on bridges | ocr-needed |
| 1 | `p1-ahead-of-its-time-chua-go` | Ahead of its time(CHƯA GÕ) | visual-layout |
| 1 | `p1-ambergris-what-is-it-and-where-does-it-come-from` | Ambergris – what is it and where does it come from? | adapter-review |
| 1 | `p1-answers-underground` | Answers Underground | transcript-review-candidates |
| 1 | `p1-antonio-stradivari-violin-maker-supreme` | Antonio Stradivari - violin maker supreme | ocr-needed |
| 1 | `p1-antonio-stradivari-violin-maker-supreme` | Antonio Stradivari - violin maker supreme | transcript-review-candidates |
| 1 | `p1-are-we-faced-with-too-much-choice` | Are we faced with too much choice? | published-match-check |
| 1 | `p1-becoming-an-expert` | Becoming an expert | adapter-review |
| 1 | `p1-book-review-triumph-of-the-city` | Book review: Triumph of the City | ocr-needed |
| 1 | `p1-book-review-triumph-of-the-city` | Book review: Triumph of the City | transcript-review-candidates |
| 1 | `p1-butterfly-farms-valuable-resource-or-insect-zoo` | Butterfly Farms: valuable resource or insect zoo? | ocr-repair-or-alternate |
| 1 | `p1-carnivorous-plants` | Carnivorous Plants | ocr-needed |
| 1 | `p1-carnivorous-plants` | Carnivorous Plants | transcript-review-candidates |
| 1 | `p1-chilli-peppers` | Chilli Peppers | transcript-review-candidates |
| 1 | `p1-chocolate-for-the-masses` | Chocolate for the masses | ocr-needed |
| 1 | `p1-chocolate-for-the-masses` | Chocolate for the masses | transcript-review-candidates |
| 1 | `p1-city-transport-uneven-progress` | CITY TRANSPORT: UNEVEN PROGRESS | ocr-needed |
| 1 | `p1-city-transport-uneven-progress` | CITY TRANSPORT: UNEVEN PROGRESS | transcript-review-candidates |
| 1 | `p1-classifying-societies` | Classifying societies | ocr-needed |
| 1 | `p1-classifying-societies` | Classifying societies | transcript-review-candidates |
| 1 | `p1-computer-games-for-preschoolers-nintendo-s-research-and-design-process` | Computer Games for Preschoolers: Nintendo's Research and Design Process | visual-layout |
| 1 | `p1-couran-cove-resort` | Couran Cove Resort | ocr-needed |
| 1 | `p1-couran-cove-resort` | Couran Cove Resort | transcript-review-candidates |
| 1 | `p1-crowding-and-density` | Crowding and Density | adapter-review |
| 1 | `p1-deep-sea-discovery` | Deep sea discovery | ocr-needed |
| 1 | `p1-deep-sea-discovery` | Deep sea discovery | transcript-review-candidates |
| 1 | `p1-deserts-and-desert-life` | Deserts and desert life | ocr-needed |
| 1 | `p1-deserts-and-desert-life` | Deserts and desert life | transcript-review-candidates |
| 1 | `p1-dolls-through-the-ages` | Dolls through the ages | ocr-needed |
| 1 | `p1-dolls-through-the-ages` | Dolls through the ages | transcript-review-candidates |
| 1 | `p1-dust-and-the-american-west` | Dust and the American West | preflight-needed |
| 1 | `p1-effect-and-cause` | Effect and Cause | visual-layout |
| 1 | `p1-ensuring-our-future-food-supply` | Ensuring our future food supply | visual-layout |
| 1 | `p1-face-recognition-in-everyday-life-chua-go` | Face recognition in everyday life(CHƯA GÕ) | visual-layout |
| 1 | `p1-feeding-the-world` | Feeding the world | source-conflict |
| 1 | `p1-fishbourne-roman-palace` | Fishbourne Roman Palace | ocr-needed |
| 1 | `p1-fishbourne-roman-palace` | Fishbourne Roman Palace | transcript-review-candidates |
| 1 | `p1-footprints-in-the-muds-of-time` | Footprints in the muds of time | visual-layout |
| 1 | `p1-forgotten-forests` | Forgotten forests | visual-layout |
| 1 | `p1-fungi-a-new-sustainable-alternative` | Fungi: a new sustainable alternative | ocr-needed |
| 1 | `p1-fungi-a-new-sustainable-alternative` | Fungi: a new sustainable alternative | transcript-review-candidates |
| 1 | `p1-how-deserts-grow` | How deserts grow | visual-layout |
| 1 | `p1-how-printed-books-began` | How printed books began | ocr-needed |
| 1 | `p1-how-printed-books-began` | How printed books began | visual-layout |
| 1 | `p1-james-hargreaves-and-the-spinning-jenny-chua-rep` | James Hargreaves and the Spinning Jenny(CHƯA REP) | ocr-repair-or-alternate |
| 1 | `p1-james-hargreaves-and-the-spinning-jenny-chua-rep` | James Hargreaves and the Spinning Jenny(CHƯA REP) | ocr-needed |
| 1 | `p1-jethro-tull-1674-1741` | Jethro Tull(1674-1741) | visual-layout |
| 1 | `p1-katherine-mansfield` | Katherine Mansfield | visual-layout |
| 1 | `p1-katsushika-hokusai` | Katsushika Hokusai | source-comparison |
| 1 | `p1-keeping-healthy-at-work` | Keeping Healthy at Work | source-conflict |
| 1 | `p1-learning-about-the-moa` | Learning about the Moa | visual-layout |
| 1 | `p1-listening-to-the-ocean` | Listening to the Ocean | ocr-needed |
| 1 | `p1-listening-to-the-ocean` | Listening to the Ocean | transcript-review-candidates |
| 1 | `p1-living-walls-a-succesful-environmental-project` | Living walls - a succesful environmental project* | visual-layout |
| 1 | `p1-making-copies` | Making copies | ocr-needed |
| 1 | `p1-making-copies` | Making copies | transcript-review-candidates |
| 1 | `p1-minds-of-their-own` | Minds of their own | transcript-review-candidates |
| 1 | `p1-museums-and-family-visitors-in-australia-loi-cham-nho-table-subhead-ien-tu-13` | Museums and family visitors in Australia (lỗi chấm nhỏ table, subhead điền từ 13) | preflight-needed |
| 1 | `p1-new-zealand-pottery` | New Zealand Pottery | visual-layout |
| 1 | `p1-no-title-a-decibel-hell-chua-rep` | No title - A Decibel Hell (CHƯA REP) | adapter-review |
| 1 | `p1-radiocarbon-dating-chua-rep` | Radiocarbon dating(CHƯA REP) | adapter-review |
| 1 | `p1-reef-fish-study-chua-rep` | Reef fish study(CHƯA REP) | visual-layout |
| 1 | `p1-reef-life-on-the-yongala` | Reef life on the Yongala | visual-layout |
| 1 | `p1-report-on-a-university-drama-project` | Report on a university drama project | visual-layout |
| 1 | `p1-research-into-elephant-sleeping-habits` | Research into elephant sleeping habits | preflight-needed |
| 1 | `p1-salt` | Salt | visual-layout |
| 1 | `p1-scented-plants` | Scented Plants | transcript-review-candidates |
| 1 | `p1-shadow-puppet-theatre-in-southeast-asia` | Shadow Puppet Theatre in Southeast Asia | visual-layout |
| 1 | `p1-solving-an-arctic-mystery` | Solving an Arctic mystery | ocr-needed |
| 1 | `p1-solving-an-arctic-mystery` | Solving an Arctic mystery | transcript-review-candidates |
| 1 | `p1-stagecoaching-in-australia` | Stagecoaching in Australia | adapter-review |
| 1 | `p1-the-blockbuster-phenomenon-a-new-museum-trend` | The Blockbuster Phenomenon - a new museum trend | version-comparison |
| 1 | `p1-the-changing-nature-of-selling` | The Changing Nature of Selling | ocr-needed |
| 1 | `p1-the-changing-nature-of-selling` | The Changing Nature of Selling | transcript-review-candidates |
| 1 | `p1-the-clipper-races-an-era-of-competition-between-cargo-ships` | The Clipper Races: an era of competition between cargo ships | ocr-repair-or-alternate |
| 1 | `p1-the-development-of-art-appreciation-in-melbourne-australia` | The development of art appreciation in Melbourne, Australia | ocr-needed |
| 1 | `p1-the-development-of-art-appreciation-in-melbourne-australia` | The development of art appreciation in Melbourne, Australia | transcript-review-candidates |
| 1 | `p1-the-development-of-the-bicycle` | The development of the bicycle | visual-layout |
| 1 | `p1-the-development-of-the-silk-industry` | The development of the silk industry | visual-layout |
| 1 | `p1-the-emergence-of-communications-media-in-the-usa` | The emergence of communications media in the USA | ocr-needed |
| 1 | `p1-the-emergence-of-communications-media-in-the-usa` | The emergence of communications media in the USA | transcript-review-candidates |
| 1 | `p1-the-extraordinary-watkin-tench-a-go-no-pdf` | The extraordinary Watkin Tench(đã gõ, no pdf) | adapter-review |
| 1 | `p1-the-future-of-news-coming-from-a-fun-circle` | The future of news – coming from a fun circle | preflight-needed |
| 1 | `p1-the-great-tit` | The Great Tit | ocr-needed |
| 1 | `p1-the-great-tit` | The Great Tit | transcript-review-candidates |
| 1 | `p1-the-health-benefits-of-singing` | The Health Benefits of Singing | visual-layout |
| 1 | `p1-the-history-and-production-of-chocolate-chua-rep` | The history and production of chocolate (CHƯA REP) | visual-layout |
| 1 | `p1-the-history-of-colours-and-the-meanings-people-have-given-them-chua-rep` | The history of colours and the meanings people have given them(CHƯA REP) | ocr-repair-or-alternate |
| 1 | `p1-the-history-of-colours-and-the-meanings-people-have-given-them-chua-rep` | The history of colours and the meanings people have given them(CHƯA REP) | ocr-needed |
| 1 | `p1-the-history-of-the-bar-code-chua-rep` | The history of the bar code(CHƯA REP) | ocr-repair-or-alternate |
| 1 | `p1-the-history-of-the-british-wool-industry` | The history of the British wool industry | adapter-review |
| 1 | `p1-the-history-of-the-chicken` | The History of the Chicken | ocr-repair-or-alternate |
| 1 | `p1-the-history-of-the-chicken` | The History of the Chicken | ocr-needed |
| 1 | `p1-the-history-of-the-pencil` | The History of the Pencil | visual-layout |
| 1 | `p1-the-history-of-the-pencil-chua-rep` | The history of the pencil (CHƯA REP) | visual-layout |
| 1 | `p1-the-iditarod` | The Iditarod | ocr-needed |
| 1 | `p1-the-iditarod` | The Iditarod | transcript-review-candidates |
| 1 | `p1-the-last-man-who-knew-everything` | The last man who knew everything | visual-layout |
| 1 | `p1-the-life-of-louis-braille` | The Life of Louis Braille | source-conflict |
| 1 | `p1-the-media-literacy-of-children-a-review-of-research-literature` | The media literacy of children: a review of research literature | visual-layout |
| 1 | `p1-the-new-zealand-national-archives` | The New Zealand National Archives | ocr-repair-or-alternate |
| 1 | `p1-the-new-zealand-national-archives` | The New Zealand National Archives | ocr-needed |
| 1 | `p1-the-oldest-leather-shoe` | The Oldest Leather Shoe | visual-layout |
| 1 | `p1-the-tuatara-of-new-zealand-chua-go` | The Tuatara of New Zealand(CHƯA GÕ) | ocr-repair-or-alternate |
| 1 | `p1-traditional-farming-in-zambia-s-luapula-province` | Traditional Farming in Zambia's Luapula Province | preflight-needed |
| 1 | `p1-treausures-of-the-forbidden-zone` | Treausures of the forbidden zone | visual-layout |
| 1 | `p1-walking-for-life` | Walking for Life | preflight-needed |
| 1 | `p1-what-are-black-holes` | What are Black Holes? | ocr-needed |
| 1 | `p1-what-are-black-holes` | What are Black Holes? | transcript-review-candidates |
| 1 | `p1-what-lucy-taught-us` | What Lucy Taught Us | ocr-needed |
| 1 | `p1-what-lucy-taught-us` | What Lucy Taught Us | transcript-review-candidates |
| 1 | `p1-why-good-ideas-fail` | Why good ideas fail | transcript-review-candidates |
| 1 | `p1-william-gilbert-and-magnetism` | William Gilbert and magnetism | preflight-needed |
| 1 | `p1-wood-a-valuable-resource-in-new-zealand-s-economy-rep-sai-20th-century-o-text-size-ques-k-eu-nhau` | Wood: a valuable resource in New Zealand's economy (rep sai 20th century ở text, size ques k đều nhau) | source-comparison |
| 2 | `p2-a-great-leap-forward` | A great leap forward | ocr-needed |
| 2 | `p2-a-great-leap-forward` | A great leap forward | transcript-review-candidates |
| 2 | `p2-a-history-of-early-inventions` | A history of early inventions | version-comparison |
| 2 | `p2-a-study-of-introvert-and-extrovert-characters` | A study of introvert and extrovert characters | version-comparison |
| 2 | `p2-a-unique-golden-textile` | A unique golden textile | ocr-needed |
| 2 | `p2-an-introduction-to-music-missing` | An introduction to music(MISSING) | source-comparison |
| 2 | `p2-antartic-research` | Antartic research | ocr-repair-or-alternate |
| 2 | `p2-antartic-research` | Antartic research | ocr-needed |
| 2 | `p2-arctic-foxes` | Arctic foxes | ocr-needed |
| 2 | `p2-are-artists-liars` | Are artists liars? | ocr-needed |
| 2 | `p2-are-artists-liars` | Are artists liars? | transcript-review-candidates |
| 2 | `p2-australia-s-artistic-heritage` | Australia's Artistic Heritage | version-comparison |
| 2 | `p2-australia-s-camouflaged-creatures` | Australia's camouflaged creatures | published-match-check |
| 2 | `p2-australian-parrots` | Australian parrots | ocr-needed |
| 2 | `p2-australian-parrots` | Australian parrots | transcript-review-candidates |
| 2 | `p2-biomimicry` | Biomimicry | ocr-needed |
| 2 | `p2-biomimicry` | Biomimicry | transcript-review-candidates |
| 2 | `p2-biophilic-design` | Biophilic Design | ocr-repair-or-alternate |
| 2 | `p2-biophilic-design` | Biophilic Design | ocr-needed |
| 2 | `p2-bird-migration` | Bird Migration | ocr-needed |
| 2 | `p2-boring-buildings` | Boring buildings | ocr-needed |
| 2 | `p2-boring-buildings` | Boring buildings | transcript-review-candidates |
| 2 | `p2-bristlecone-pines` | Bristlecone Pines | ocr-needed |
| 2 | `p2-bristlecone-pines` | Bristlecone Pines | transcript-review-candidates |
| 2 | `p2-buying-time` | Buying Time | version-comparison |
| 2 | `p2-can-a-global-database-of-fossils-help-us-predict-the-future-of-biodiversity-on-earth` | Can a global database of fossils help us predict the future of biodiversity on Earth? | ocr-needed |
| 2 | `p2-can-a-global-database-of-fossils-help-us-predict-the-future-of-biodiversity-on-earth` | Can a global database of fossils help us predict the future of biodiversity on Earth? | transcript-review-candidates |
| 2 | `p2-canal-discovered-at-ancient-quarry-in-egypt` | Canal discovered at ancient quarry in Egypt | source-conflict |
| 2 | `p2-children-s-comprehension-of-television-advertising-toan-bo-et-al-chua-italic` | Children's comprehension of television advertising (toàn bộ et al chưa italic) | ocr-needed |
| 2 | `p2-children-s-comprehension-of-television-advertising-toan-bo-et-al-chua-italic` | Children's comprehension of television advertising (toàn bộ et al chưa italic) | transcript-review-candidates |
| 2 | `p2-classical-music-over-the-centuries` | Classical music over the centuries | ocr-repair-or-alternate |
| 2 | `p2-classical-music-over-the-centuries` | Classical music over the centuries | ocr-needed |
| 2 | `p2-coins-the-first-form-of-money` | Coins - the first form of money | adapter-review |
| 2 | `p2-considerate-technology-chua-rep` | Considerate Technology (chưa rep) | adapter-review |
| 2 | `p2-dark-chocolate-s-health-giving-benefits` | Dark Chocolate's Health-giving Benefits | ocr-needed |
| 2 | `p2-dark-chocolate-s-health-giving-benefits` | Dark Chocolate's Health-giving Benefits | transcript-review-candidates |
| 2 | `p2-digital-analysis-of-literature` | Digital analysis of literature | source-conflict |
| 2 | `p2-do-animals-really-remember` | Do animals really remember? | ocr-needed |
| 2 | `p2-do-animals-really-remember` | Do animals really remember? | transcript-review-candidates |
| 2 | `p2-dolphins-and-language-learning` | Dolphins and Language Learning | version-comparison |
| 2 | `p2-dominance-in-social-insects` | Dominance in Social Insects | ocr-needed |
| 2 | `p2-dominance-in-social-insects` | Dominance in Social Insects | transcript-review-candidates |
| 2 | `p2-early-approaches-to-organisational-design` | Early approaches to organisational design | ocr-needed |
| 2 | `p2-early-approaches-to-organisational-design` | Early approaches to organisational design | transcript-review-candidates |
| 2 | `p2-egypt-s-ancient-boat-builders-chua-go` | Egypt's ancient boat-builders (chưa gõ) | ocr-repair-or-alternate |
| 2 | `p2-egypt-s-ancient-boat-builders-chua-go` | Egypt's ancient boat-builders (chưa gõ) | ocr-needed |
| 2 | `p2-farmers-chua-rep` | Farmers(CHƯA REP) | version-comparison |
| 2 | `p2-flood-control-in-the-usa` | Flood control in the USA | ocr-needed |
| 2 | `p2-flood-control-in-the-usa` | Flood control in the USA | transcript-review-candidates |
| 2 | `p2-follow-your-nose` | Follow your nose | ocr-needed |
| 2 | `p2-follow-your-nose` | Follow your nose | transcript-review-candidates |
| 2 | `p2-fragrant-memories` | Fragrant memories | ocr-needed |
| 2 | `p2-from-princes-to-paupers-how-goya-s-portraits-tell-the-story-of-spain` | From princes to paupers: how Goya's portraits tell the story of Spain* | version-comparison |
| 2 | `p2-goya-s-portraits` | Goya's portraits | published-match-check |
| 2 | `p2-growing-more-for-less` | Growing more for less | ocr-needed |
| 2 | `p2-growing-more-for-less` | Growing more for less | transcript-review-candidates |
| 2 | `p2-honeybees-face-a-fight-for-survival` | Honeybees face a fight for survival | ocr-repair-or-alternate |
| 2 | `p2-how-to-be-happy` | How to be Happy | published-match-check |
| 2 | `p2-icebergs-as-a-water-source-chua-go` | Icebergs as a Water Source(CHƯA GÕ) | ocr-needed |
| 2 | `p2-icebergs-as-a-water-source-chua-go` | Icebergs as a Water Source(CHƯA GÕ) | transcript-review-candidates |
| 2 | `p2-influences-on-child-development` | Influences on Child Development | visual-layout |
| 2 | `p2-intelligent-behavior-in-birds` | Intelligent behavior in birds | ocr-repair-or-alternate |
| 2 | `p2-intelligent-behavior-in-birds` | Intelligent behavior in birds | ocr-needed |
| 2 | `p2-investment-in-shares-versus-investment-in-other-assets-which-gives-the-greater-gain` | Investment in shares versus investment in other assets - which gives the greater gain? | ocr-needed |
| 2 | `p2-investment-in-shares-versus-investment-in-other-assets-which-gives-the-greater-gain` | Investment in shares versus investment in other assets - which gives the greater gain? | transcript-review-candidates |
| 2 | `p2-iq-scores` | IQ Scores | ocr-repair-or-alternate |
| 2 | `p2-iq-scores` | IQ Scores | ocr-needed |
| 2 | `p2-john-ray-and-the-study-of-plants` | John Ray and the Study of Plants | published-match-check |
| 2 | `p2-lake-bosumtwi-the-secrets-of-a-crater-lake` | Lake Bosumtwi - the secrets of a crater lake | ocr-needed |
| 2 | `p2-lean-production-innovation-in-manufacturing-systems-e-g-rep-sai` | Lean Production – innovation in manufacturing systems (E G rep sai) | source-comparison |
| 2 | `p2-mammoth-kill` | MAMMOTH KILL | ocr-needed |
| 2 | `p2-mammoth-kill` | MAMMOTH KILL | transcript-review-candidates |
| 2 | `p2-management-brains` | Management Brains | ocr-needed |
| 2 | `p2-management-brains` | Management Brains | transcript-review-candidates |
| 2 | `p2-mimicry-and-parenting` | Mimicry and parenting | ocr-needed |
| 2 | `p2-moon-search` | Moon Search | version-comparison |
| 2 | `p2-nanotechnology-the-science-of-the-very-small` | Nanotechnology: the science of the very small | ocr-needed |
| 2 | `p2-nanotechnology-the-science-of-the-very-small` | Nanotechnology: the science of the very small | transcript-review-candidates |
| 2 | `p2-nature-s-numbers` | Nature's numbers | ocr-needed |
| 2 | `p2-nature-s-numbers` | Nature's numbers | transcript-review-candidates |
| 2 | `p2-natures-positive-effects-on-well-being` | Nature’s positive effects on well-being | ocr-repair-or-alternate |
| 2 | `p2-new-filter-promises-clean-water-for-millions` | New filter promises clean water for millions | visual-layout |
| 2 | `p2-no-title-the-ecological-importance-of-bees` | No title - The Ecological Importance of Bees | ocr-repair-or-alternate |
| 2 | `p2-no-title-the-ecological-importance-of-bees` | No title - The Ecological Importance of Bees | ocr-needed |
| 2 | `p2-of-horses-teeth-and-regulation` | Of horses' teeth and regulation | preflight-needed |
| 2 | `p2-on-the-trail-of-the-artist` | On the trail of the artist | published-match-check |
| 2 | `p2-orientation-of-birds` | Orientation of birds | ocr-repair-or-alternate |
| 2 | `p2-orientation-of-birds` | Orientation of birds | ocr-needed |
| 2 | `p2-our-sense-of-smell` | Our Sense of Smell | adapter-review |
| 2 | `p2-pantomime` | Pantomime | ocr-repair-or-alternate |
| 2 | `p2-pantomime` | Pantomime | ocr-needed |
| 2 | `p2-paternity-leave` | Paternity Leave | ocr-needed |
| 2 | `p2-paternity-leave` | Paternity Leave | transcript-review-candidates |
| 2 | `p2-patterns-of-settlement-in-the-english-countryside-chua-go` | Patterns of settlement in the English countryside(CHƯA GÕ) | ocr-repair-or-alternate |
| 2 | `p2-patterns-of-settlement-in-the-english-countryside-chua-go` | Patterns of settlement in the English countryside(CHƯA GÕ) | ocr-needed |
| 2 | `p2-photography` | Photography | version-comparison |
| 2 | `p2-playing-with-science` | Playing with science | ocr-repair-or-alternate |
| 2 | `p2-playing-with-science` | Playing with science | ocr-needed |
| 2 | `p2-public-art-programs-research-update` | Public art programs: research update | source-conflict |
| 2 | `p2-redwoods-a-d-22-rep-sai` | Redwoods (A, D, 22 rep sai) | source-comparison |
| 2 | `p2-science-and-the-stradivarius` | Science and the Stradivarius | ocr-repair-or-alternate |
| 2 | `p2-seeing-in-the-sea` | Seeing in the sea | published-match-check |
| 2 | `p2-should-space-be-explored-by-robots-or-by-humans-f-rep-sai` | Should space be explored by robots or by humans? (F rep sai) | source-comparison |
| 2 | `p2-should-top-managers-be-promoted-from-within-the-company-or-hired-from-outside-chua-go` | Should top managers be promoted from within the company, or hired from outside?(CHƯA GÕ) | ocr-repair-or-alternate |
| 2 | `p2-should-top-managers-be-promoted-from-within-the-company-or-hired-from-outside-chua-go` | Should top managers be promoted from within the company, or hired from outside?(CHƯA GÕ) | ocr-needed |
| 2 | `p2-sir-gawain-and-the-green-knight` | Sir Gawain and the Green Knight | ocr-needed |
| 2 | `p2-sir-gawain-and-the-green-knight` | Sir Gawain and the Green Knight | transcript-review-candidates |
| 2 | `p2-speaking-of-nothing-a-rep-sai` | Speaking of Nothing (A rep sai) | source-comparison |
| 2 | `p2-stress-less` | Stress Less | ocr-needed |
| 2 | `p2-surviving-city-life` | Surviving city life | ocr-repair-or-alternate |
| 2 | `p2-surviving-city-life` | Surviving city life | ocr-needed |
| 2 | `p2-the-2003-heat-wave-chua-go-no-pdf` | The 2003 Heat Wave (chưa gõ/no pdf) | ocr-needed |
| 2 | `p2-the-2003-heat-wave-chua-go-no-pdf` | The 2003 Heat Wave (chưa gõ/no pdf) | transcript-review-candidates |
| 2 | `p2-the-advantages-of-being-bilingual-a-rep-sai` | The advantages of being bilingual (A rep sai) | source-comparison |
| 2 | `p2-the-aerofoil` | The aerofoil | ocr-needed |
| 2 | `p2-the-aerofoil` | The aerofoil | transcript-review-candidates |
| 2 | `p2-the-alps-2-ocean-cycle-trail` | The Alps 2 Ocean Cycle Trail | ocr-needed |
| 2 | `p2-the-alps-2-ocean-cycle-trail` | The Alps 2 Ocean Cycle Trail | transcript-review-candidates |
| 2 | `p2-the-attraction-of-video-games-chua-rep-heading-cho-sapo-hep-lai` | The attraction of video games (chưa rep heading, cho sapo hẹp lại) | adapter-review |
| 2 | `p2-the-beginning-of-the-consumer-age` | The beginning of the consumer age | ocr-needed |
| 2 | `p2-the-beginning-of-the-consumer-age` | The beginning of the consumer age | transcript-review-candidates |
| 2 | `p2-the-city-of-great-zimbabwe-f-oan-2-rep-sai` | The city of Great Zimbabwe (F đoạn 2 rep sai) | source-comparison |
| 2 | `p2-the-coastal-archaeology-of-britain` | The Coastal Archaeology of Britain | ocr-needed |
| 2 | `p2-the-coastal-archaeology-of-britain` | The Coastal Archaeology of Britain | transcript-review-candidates |
| 2 | `p2-the-constant-evolution-of-the-humble-tomato-chua-go` | The Constant Evolution of the Humble Tomato(CHƯA GÕ) | ocr-repair-or-alternate |
| 2 | `p2-the-constant-evolution-of-the-humble-tomato-chua-go` | The Constant Evolution of the Humble Tomato(CHƯA GÕ) | ocr-needed |
| 2 | `p2-the-development-of-television-and-its-introduction-in-britain` | The development of television and its introduction in Britain | ocr-needed |
| 2 | `p2-the-development-of-television-and-its-introduction-in-britain` | The development of television and its introduction in Britain | transcript-review-candidates |
| 2 | `p2-the-discovery-of-a-baby-mammoth` | The discovery of a baby mammoth | ocr-needed |
| 2 | `p2-the-discovery-of-a-baby-mammoth` | The discovery of a baby mammoth | transcript-review-candidates |
| 2 | `p2-the-economic-effect-of-climate-no-pdf` | The economic effect of climate (no pdf) | ocr-needed |
| 2 | `p2-the-economic-effect-of-climate-no-pdf` | The economic effect of climate (no pdf) | transcript-review-candidates |
| 2 | `p2-the-elnino-effect-no-pdf` | The Elnino effect (no pdf) | ocr-needed |
| 2 | `p2-the-elnino-effect-no-pdf` | The Elnino effect (no pdf) | transcript-review-candidates |
| 2 | `p2-the-gender-gap-in-new-zealand-s-high-school-examination-results` | The gender gap in New Zealand's high school examination results | published-match-check |
| 2 | `p2-the-importance-of-diet-chua-rep` | The importance of diet(CHƯA REP) | ocr-needed |
| 2 | `p2-the-importance-of-diet-chua-rep` | The importance of diet(CHƯA REP) | transcript-review-candidates |
| 2 | `p2-the-importance-of-the-human-urge-to-move` | The importance of the human urge to move | source-conflict |
| 2 | `p2-the-legacy-of-stanislavsky` | The Legacy of Stanislavsky | ocr-needed |
| 2 | `p2-the-legacy-of-stanislavsky` | The Legacy of Stanislavsky | transcript-review-candidates |
| 2 | `p2-the-little-ice-age` | The Little Ice Age | ocr-repair-or-alternate |
| 2 | `p2-the-little-ice-age` | The Little Ice Age | ocr-needed |
| 2 | `p2-the-lost-city` | THE LOST CITY | ocr-needed |
| 2 | `p2-the-lost-city` | THE LOST CITY | transcript-review-candidates |
| 2 | `p2-the-many-benefits-of-mangrove-chua-rep` | The many benefits of mangrove(CHƯA REP) | adapter-review |
| 2 | `p2-the-nature-and-characteristics-of-memory` | The nature and characteristics of memory | ocr-repair-or-alternate |
| 2 | `p2-the-nature-and-characteristics-of-memory` | The nature and characteristics of memory | ocr-needed |
| 2 | `p2-the-perfume-hunters` | THE PERFUME HUNTERS | published-match-check |
| 2 | `p2-the-power-of-music` | The power of music | preflight-needed |
| 2 | `p2-the-problem-with-aiming-for-average` | The problem with aiming for average | ocr-needed |
| 2 | `p2-the-problem-with-aiming-for-average` | The problem with aiming for average | transcript-review-candidates |
| 2 | `p2-the-purpose-of-facial-expressions-a-thieu-em-dash` | The purpose of facial expressions (A thiếu em dash) | source-comparison |
| 2 | `p2-the-restoration-of-baja-california-s-fishing-communities` | The restoration of Baja California's fishing communities | ocr-needed |
| 2 | `p2-the-restoration-of-baja-california-s-fishing-communities` | The restoration of Baja California's fishing communities | transcript-review-candidates |
| 2 | `p2-the-return-of-monkey-life-co-pdf-k-move-c` | The return of monkey life(có pdf, k move đc) | ocr-repair-or-alternate |
| 2 | `p2-the-return-of-monkey-life-co-pdf-k-move-c` | The return of monkey life(có pdf, k move đc) | ocr-needed |
| 2 | `p2-the-rise-in-importance-of-the-domestic-chicken-2-in-5-rep-sai` | The Rise in Importance of the Domestic Chicken (2 in 5 rep sai) | source-comparison |
| 2 | `p2-the-role-of-error-in-the-learning-process` | The role of error in the learning process | ocr-repair-or-alternate |
| 2 | `p2-the-role-of-error-in-the-learning-process` | The role of error in the learning process | ocr-needed |
| 2 | `p2-the-story-of-the-ocean` | The story of the ocean | ocr-repair-or-alternate |
| 2 | `p2-the-story-of-the-ocean` | The story of the ocean | ocr-needed |
| 2 | `p2-the-study-of-film` | The study of film | ocr-needed |
| 2 | `p2-the-study-of-film` | The study of film | transcript-review-candidates |
| 2 | `p2-the-tasmanian-tiger` | The Tasmanian Tiger | ocr-repair-or-alternate |
| 2 | `p2-understanding-climate-change` | Understanding climate change | ocr-repair-or-alternate |
| 2 | `p2-understanding-climate-change` | Understanding climate change | ocr-needed |
| 2 | `p2-urban-regeneration-an-award-winning-redevelopment-project-in-berlin-chua-rep` | Urban Regeneration: an award-winning redevelopment project in Berlin(CHƯA REP) | ocr-needed |
| 2 | `p2-urban-regeneration-an-award-winning-redevelopment-project-in-berlin-chua-rep` | Urban Regeneration: an award-winning redevelopment project in Berlin(CHƯA REP) | transcript-review-candidates |
| 2 | `p2-what-kind-of-structure-will-make-living-in-space-comfortable-for-us` | What kind of structure will make living in space comfortable for us | preflight-needed |
| 2 | `p2-why-do-singers-lose-their-voices` | Why do singers lose their voices | ocr-needed |
| 2 | `p2-why-do-singers-lose-their-voices` | Why do singers lose their voices | transcript-review-candidates |
| 2 | `p2-will-eating-less-make-you-live-longer` | Will Eating Less Make You Live Longer? | ocr-needed |
| 2 | `p2-will-eating-less-make-you-live-longer` | Will Eating Less Make You Live Longer? | transcript-review-candidates |
| 3 | `p3-200-years-of-australian-landscapes-at-the-royal-academy-in-london` | 200 Years of Australian Landscapes at the Royal Academy in London | ocr-repair-or-alternate |
| 3 | `p3-200-years-of-australian-landscapes-at-the-royal-academy-in-london` | 200 Years of Australian Landscapes at the Royal Academy in London | ocr-needed |
| 3 | `p3-a-new-stage-in-the-study-and-teaching-of-history` | A new stage in the study and teaching of history | ocr-needed |
| 3 | `p3-a-new-stage-in-the-study-and-teaching-of-history` | A new stage in the study and teaching of history | transcript-review-candidates |
| 3 | `p3-a-review-of-leon-holbrook-s-book-we-should-live-in-cities` | A review of Leon Holbrook's book 'We Should Live In Cities' | version-comparison |
| 3 | `p3-all-in-the-family` | All in the family | ocr-needed |
| 3 | `p3-anthropology` | Anthropology | version-comparison |
| 3 | `p3-anthropology` | Anthropology* | version-comparison |
| 3 | `p3-asian-space-return-of-an-asian-invention` | Asian space: return of an Asian invention | ocr-repair-or-alternate |
| 3 | `p3-asian-space-return-of-an-asian-invention` | Asian space: return of an Asian invention | ocr-needed |
| 3 | `p3-australias-megafauna-controversy` | Australia’s Megafauna Controversy | ocr-needed |
| 3 | `p3-avalanches` | AVALANCHES | published-match-check |
| 3 | `p3-back-to-the-future-of-skyscraper-design` | Back to the future of skyscraper design | preflight-needed |
| 3 | `p3-blind-to-change-doan-4-tu-duoi-len-rep-sai` | Blind to Change (doạn 4 từ dưới lên rep sai) | source-comparison |
| 3 | `p3-book-review-the-discovery-of-slowness` | Book Review: The discovery of Slowness | ocr-needed |
| 3 | `p3-book-review-the-discovery-of-slowness` | Book Review: The discovery of Slowness | transcript-review-candidates |
| 3 | `p3-brutalist-architecture` | Brutalist Architecture | preflight-needed |
| 3 | `p3-business-innovation` | BUSINESS INNOVATION | ocr-needed |
| 3 | `p3-business-innovation` | BUSINESS INNOVATION | transcript-review-candidates |
| 3 | `p3-case-study-cargill-dow-llc` | Case Study: Cargill Dow LLC | visual-layout |
| 3 | `p3-children-and-symbols` | Children and Symbols | ocr-needed |
| 3 | `p3-conformity-chua-rep` | Conformity(CHƯA REP) | ocr-needed |
| 3 | `p3-conformity-chua-rep` | Conformity(CHƯA REP) | transcript-review-candidates |
| 3 | `p3-creating-a-better-grapefruit` | Creating a Better Grapefruit | ocr-needed |
| 3 | `p3-flower-power` | Flower Power | preflight-needed |
| 3 | `p3-game-theory` | Game theory | ocr-needed |
| 3 | `p3-green-fingers-and-green-thoughts` | Green Fingers and Green Thoughts | published-match-check |
| 3 | `p3-green-roofs-blurred` | Green roofs(BLURRED) | ocr-repair-or-alternate |
| 3 | `p3-green-roofs-blurred` | Green roofs(BLURRED) | ocr-needed |
| 3 | `p3-grimm-s-fairy-tales` | Grimm's Fairy Tales | version-comparison |
| 3 | `p3-grimm-s-fairy-tales` | Grimm's Fairy Tales* | version-comparison |
| 3 | `p3-group-behaviour` | Group Behaviour | version-comparison |
| 3 | `p3-honeybees-in-trouble-can-native-pollinators-fill-the-gap-chua-go` | Honeybees in trouble - can native pollinators fill the gap?(CHƯA GÕ) | transcript-review-candidates |
| 3 | `p3-how-a-prehistoric-predator-took-to-the-skies` | How a prehistoric predator took to the skies | ocr-repair-or-alternate |
| 3 | `p3-how-a-prehistoric-predator-took-to-the-skies` | How a prehistoric predator took to the skies | ocr-needed |
| 3 | `p3-how-did-music-begin-chua-rep` | How did music begin(CHƯA REP) | ocr-needed |
| 3 | `p3-how-did-music-begin-chua-rep` | How did music begin(CHƯA REP) | transcript-review-candidates |
| 3 | `p3-how-have-humans-changed` | How have humans changed? | ocr-needed |
| 3 | `p3-how-have-humans-changed` | How have humans changed? | transcript-review-candidates |
| 3 | `p3-how-to-win-the-world-memory-championship` | How to win the World Memory Championship | ocr-needed |
| 3 | `p3-humanities-and-the-health-professional` | Humanities and the health professional | ocr-needed |
| 3 | `p3-improving-patient-safety` | Improving Patient Safety | ocr-repair-or-alternate |
| 3 | `p3-improving-patient-safety` | Improving Patient Safety | ocr-needed |
| 3 | `p3-inside-the-mind-of-a-fan` | Inside the mind of a fan | ocr-needed |
| 3 | `p3-inside-the-mind-of-a-fan` | Inside the mind of a fan | transcript-review-candidates |
| 3 | `p3-is-teleworking-sustainable` | Is teleworking sustainable? | ocr-needed |
| 3 | `p3-jean-piaget-1896-1980` | Jean Piaget 1896 – 1980 | ocr-repair-or-alternate |
| 3 | `p3-jean-piaget-1896-1980` | Jean Piaget 1896 – 1980 | ocr-needed |
| 3 | `p3-language-change` | Language change | ocr-repair-or-alternate |
| 3 | `p3-learning-to-be-bilingual` | Learning to be bilingual | ocr-needed |
| 3 | `p3-leo-burnett-1891-1971` | Leo Burnett 1891 - 1971 | ocr-needed |
| 3 | `p3-let-s-all-be-friends-chua-rep` | Let's all be friends(CHƯA REP) | ocr-repair-or-alternate |
| 3 | `p3-let-s-all-be-friends-chua-rep` | Let's all be friends(CHƯA REP) | ocr-needed |
| 3 | `p3-let-s-teach-them-how-to-teach` | Let's teach them how to teach | ocr-repair-or-alternate |
| 3 | `p3-let-s-teach-them-how-to-teach` | Let's teach them how to teach | ocr-needed |
| 3 | `p3-life-on-mars` | LIFE ON MARS? | ocr-repair-or-alternate |
| 3 | `p3-life-on-mars` | LIFE ON MARS? | ocr-needed |
| 3 | `p3-living-dunes` | Living dunes | ocr-repair-or-alternate |
| 3 | `p3-living-dunes` | Living dunes | ocr-needed |
| 3 | `p3-managing-the-language-barrier-in-international-business` | Managing the language barrier in international business | ocr-needed |
| 3 | `p3-managing-the-language-barrier-in-international-business` | Managing the language barrier in international business | transcript-review-candidates |
| 3 | `p3-mapping-the-mind` | Mapping the Mind | ocr-repair-or-alternate |
| 3 | `p3-mapping-the-mind` | Mapping the Mind | ocr-needed |
| 3 | `p3-marine-mammals-exhibit-their-ingenuity` | Marine mammals exhibit their ingenuity | ocr-needed |
| 3 | `p3-marketing-and-mind-control` | Marketing and mind control | ocr-repair-or-alternate |
| 3 | `p3-marketing-and-mind-control` | Marketing and mind control | ocr-needed |
| 3 | `p3-marketing-and-the-information-age` | Marketing and the information age | visual-layout |
| 3 | `p3-memory-champions-or-just-good-at-tricks` | Memory Champions or just good at tricks | visual-layout |
| 3 | `p3-motivating-employees` | Motivating employees | ocr-repair-or-alternate |
| 3 | `p3-motivating-employees` | Motivating employees | ocr-needed |
| 3 | `p3-music-soothes-and-awes-and-may-help-us-heal` | Music soothes and awes - and may help us heal | ocr-needed |
| 3 | `p3-music-soothes-and-awes-and-may-help-us-heal` | Music soothes and awes - and may help us heal | transcript-review-candidates |
| 3 | `p3-no-title-about-sea` | No title - about sea | ocr-needed |
| 3 | `p3-no-title-about-sea` | No title - about sea | transcript-review-candidates |
| 3 | `p3-no-title-charles-darwin-chua-rep` | No title - Charles Darwin(CHƯA REP) | ocr-repair-or-alternate |
| 3 | `p3-on-art-and-artists` | On art and artists | ocr-needed |
| 3 | `p3-practical-learning-in-the-classroom` | Practical Learning in the Classroom | ocr-repair-or-alternate |
| 3 | `p3-practical-learning-in-the-classroom` | Practical Learning in the Classroom | ocr-needed |
| 3 | `p3-rating-female-leaders` | Rating Female Leaders | ocr-needed |
| 3 | `p3-rating-female-leaders` | Rating Female Leaders | transcript-review-candidates |
| 3 | `p3-reading-greek` | Reading Greek | ocr-needed |
| 3 | `p3-recording-history` | Recording History | ocr-repair-or-alternate |
| 3 | `p3-recording-history` | Recording History | ocr-needed |
| 3 | `p3-refraction` | REFRACTION | preflight-needed |
| 3 | `p3-risk-taking` | Risk taking | ocr-needed |
| 3 | `p3-risk-taking` | Risk taking | transcript-review-candidates |
| 3 | `p3-saving-the-skink` | Saving the Skink | ocr-needed |
| 3 | `p3-saving-the-skink` | Saving the Skink | transcript-review-candidates |
| 3 | `p3-science-and-knowledge` | Science and knowledge | version-comparison |
| 3 | `p3-science-in-the-kitchen` | Science in the kitchen | preflight-needed |
| 3 | `p3-sea-change-for-salinity` | Sea Change for Salinity | preflight-needed |
| 3 | `p3-sign-baby-sign` | Sign, baby, sign! | ocr-needed |
| 3 | `p3-studying-the-history-of-medieval-britain` | Studying the history of medieval Britain | ocr-needed |
| 3 | `p3-sydney-opera-house` | Sydney Opera House | published-match-check |
| 3 | `p3-termite-mounds-chua-rep` | Termite Mounds(CHƯA REP) | ocr-needed |
| 3 | `p3-the-ability-to-communicate-using-language` | The ability to communicate using language | ocr-needed |
| 3 | `p3-the-beginnings-of-modern-cognition` | The beginnings of modern cognition | source-conflict |
| 3 | `p3-the-benefits-of-learning-an-instrument` | The benefits of learning an instrument | ocr-repair-or-alternate |
| 3 | `p3-the-benefits-of-learning-an-instrument` | The benefits of learning an instrument | ocr-needed |
| 3 | `p3-the-contradiction-of-tourism` | The contradiction of tourism | ocr-repair-or-alternate |
| 3 | `p3-the-contradiction-of-tourism` | The contradiction of tourism | ocr-needed |
| 3 | `p3-the-digital-revolution-in-studying-history` | The Digital Revolution in Studying History | version-comparison |
| 3 | `p3-the-dunedin-study` | The Dunedin study | published-match-check |
| 3 | `p3-the-flouridation-controversy` | The flouridation controversy | ocr-needed |
| 3 | `p3-the-flouridation-controversy` | The flouridation controversy | transcript-review-candidates |
| 3 | `p3-the-future-of-the-world-s-languages` | The future of the world's languages | ocr-repair-or-alternate |
| 3 | `p3-the-future-of-the-world-s-languages` | The future of the world's languages | ocr-needed |
| 3 | `p3-the-irish-elk` | The Irish Elk | visual-layout |
| 3 | `p3-the-lost-animals-of-australia` | The lost animals of Australia | preflight-needed |
| 3 | `p3-the-peopling-of-patagonia` | The peopling of Patagonia | ocr-needed |
| 3 | `p3-the-peopling-of-patagonia` | The peopling of Patagonia | transcript-review-candidates |
| 3 | `p3-the-robbers-cave-study` | The Robbers Cave Study | ocr-repair-or-alternate |
| 3 | `p3-the-robbers-cave-study` | The Robbers Cave Study | ocr-needed |
| 3 | `p3-the-search-for-extra-terrestrial-life` | The search for extra-terrestrial life | ocr-repair-or-alternate |
| 3 | `p3-the-search-for-extra-terrestrial-life` | The search for extra-terrestrial life | ocr-needed |
| 3 | `p3-the-secret-sounds-of-elephants` | The secret sounds of elephants | ocr-needed |
| 3 | `p3-the-significant-role-of-mother-tongue-in-education` | The significant role of mother tongue in education | ocr-repair-or-alternate |
| 3 | `p3-the-sound-recording-industry-in-the-usa-before-1950` | The sound recording industry in the USA before 1950 | ocr-needed |
| 3 | `p3-the-tuatara-past-and-future` | The tuatara - past and future | ocr-needed |
| 3 | `p3-the-tuatara-past-and-future` | The tuatara - past and future | transcript-review-candidates |
| 3 | `p3-the-value-of-literary-prizes` | The value of literary prizes | ocr-needed |
| 3 | `p3-thinking-small-globalization-and-the-choice-of-technology` | Thinking Small: Globalization and the Choice of Technology | ocr-repair-or-alternate |
| 3 | `p3-thinking-small-globalization-and-the-choice-of-technology` | Thinking Small: Globalization and the Choice of Technology | ocr-needed |
| 3 | `p3-tick-tock-body-clock` | Tick Tock Body Clock | published-match-check |
| 3 | `p3-traffic-congestion-possible-solutions-to-an-increasing-problem` | Traffic congestion: possible solutions to an increasing problem | visual-layout |
| 3 | `p3-travelling-on-light` | Travelling on Light | adapter-review |
| 3 | `p3-whale-culture` | WHALE CULTURE | ocr-needed |
| 3 | `p3-what-happened-to-other-human-species` | What happened to other human species? | version-comparison |
| 3 | `p3-what-is-history` | What is history? | ocr-needed |
| 3 | `p3-what-is-history` | What is history? | transcript-review-candidates |
| 3 | `p3-what-makes-a-musical-expert` | What makes a musical expert? | ocr-repair-or-alternate |
| 3 | `p3-what-makes-a-musical-expert` | What makes a musical expert? | ocr-needed |
| 3 | `p3-what-makes-organisations-successful` | What makes organisations successful? | ocr-needed |
| 3 | `p3-what-makes-organisations-successful` | What makes organisations successful? | transcript-review-candidates |
| 3 | `p3-when-people-are-deaf-to-music` | When people are 'deaf' to music | ocr-needed |
| 3 | `p3-when-people-are-deaf-to-music` | When people are 'deaf' to music | transcript-review-candidates |
| 3 | `p3-why-good-food-tastes-good-chua-rep` | Why Good Food Tastes Good(CHƯA REP) | version-comparison |
| 3 | `p3-yawning-chua-rep` | Yawning(CHƯA REP) | ocr-repair-or-alternate |

## E. Hàm instructions hiện hành — snapshot chính xác
```javascript
 function instructions(g,d){
  const countWords=['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty','twenty-one','twenty-two','twenty-three','twenty-four','twenty-five','twenty-six'];
  const word=g.wordLimit?'<strong>'+g.wordLimit+'</strong>':'';
  const scopeLetters=g.sourceParagraphs||[];const scopeText=scopeLetters.length>1?scopeLetters.slice(0,-1).join(', ')+' '+(g.sourceParagraphJoiner||'and')+' '+scopeLetters.at(-1):scopeLetters[0];const from=scopeLetters.length?' from paragraph'+(scopeLetters.length>1?'s':'')+' <strong>'+scopeText+'</strong>':' from the passage';
  const stance=/views/i.test(g.sourceInstructions)?'views':'claims';
  const common={
   tfng:'Choose <strong>TRUE</strong> if the statement agrees with the information, choose <strong>FALSE</strong> if the statement contradicts the information, or choose <strong>NOT GIVEN</strong> if there is no information on this.',
   ynng:'Choose <strong>YES</strong> if the statement agrees with the '+stance+' of the writer, choose <strong>NO</strong> if the statement contradicts the '+stance+' of the writer, or choose <strong>NOT GIVEN</strong> if it is impossible to say what the writer thinks about this.',
   'mc-one':'Choose the correct answer.','mc-two':'Choose <strong>'+(g.selectionCount===3?'THREE':'TWO')+'</strong> correct answers.',
   'matching-info':'The text has '+(countWords[g.paragraphCount]||g.paragraphCount)+' paragraphs, <strong>'+(g.letters?.[0]||'')+'–'+(g.letters?.at(-1)||'')+'</strong>. Which paragraph contains the following information?'+(g.reuse?' You may choose any letter more than once.':''),
   'matching-features':'Choose the correct '+(g.targetName||'researcher')+'.'+(g.reuse?' You may choose any '+(g.targetName||'researcher')+' more than once.':''),
   'matching-headings':'Choose the correct heading for each paragraph from the list of headings and move it into the gap.',
   'matching-endings':'Complete each sentence with the correct ending. Choose the correct answer and move it into the gap.',
   'summary-input':'Complete the '+(g.task||'summary')+'. Write '+word+from+' for each answer.',
   'summary-drag':'Complete the summary'+(g.summaryScope?' of '+g.summaryScope:'')+' using the list of words. Choose the correct answer and move it into the gap.',
   notes:'Complete the '+(g.task||'notes')+'. Write '+word+from+' for each answer.',
   diagram:g.bank?'Label the diagram using the list of words. Choose the correct answer and move it into the gap.':'Label the diagram. Write '+word+from+' for each answer.',
   'flow-chart':'Complete the flow-chart. Write '+word+from+' for each answer.',
   'short-answer':'Answer the questions. Write '+word+from+' for each answer.'
  };return common[g.type];
 }

```

## F. CSS chuẩn hiện hành — giữ nguyên các thông số khi tiếp tục


### `dist/question-template.css`

```css
/* Generated from reading-sample.html. Edit the sample, not this file. */
/* COMMON / MATCHING INFORMATION / MULTIPLE CHOICE TWO / SUMMARY INPUT */
html body .passage-example-heading{font:inherit;font-weight:700;line-height:inherit;margin:0 0 .15em;padding:0;border:0;background:none;}
html body .sec-hdr{font-weight:700;font-size:16px;margin-bottom:10px;margin-top:22px;color:#000;}
html body .sec-hdr:first-child{margin-top:24px;}
html body .sec-inst{font-size:16px;line-height:1.5;color:#222;margin-bottom:16px;}
html body .grid-outer{position:relative;border:1px solid #000;padding:40px 12px 40px 12px;margin-bottom:6px;background:#fff;width:100%;max-width:min(100%,1175px);box-sizing:border-box;}
html body .grid-tbl{width:100%;border-collapse:collapse;table-layout:auto;font-family:Arial,Helvetica,sans-serif;}
html body .grid-tbl thead th{font-weight:700;font-size:16px;color:#111;text-align:center;padding:15px 0;background:#fff;border-bottom:2.5px solid #000;border-right:1px solid #000;}
html body .grid-tbl thead th:last-child{border-right:none;}
html body .grid-tbl tbody tr{background:#fff;}
html body .grid-tbl tbody tr td{border-bottom:1px solid #000;background:#fff;}
html body .grid-tbl tbody tr:nth-child(2) td,html body .grid-tbl tbody tr:nth-child(4) td{border-bottom:1.5px solid #000;}
html body .grid-tbl tbody tr:last-child td{border-bottom:none;}
html body .td-q{padding:20px 14px 20px 10px;font-size:16px;line-height:1.5;color:#111;vertical-align:top;text-align:left;border-right:2px solid #000;}
html body .td-q-inner{display:flex;align-items:baseline;gap:8px;}
html body .qnum{font-weight:700;font-size:16px;color:#111;white-space:nowrap;flex-shrink:0;cursor:pointer;line-height:1.5;min-width:22px;padding:2px 5px;display:inline-flex;align-items:center;justify-content:center;outline:2px solid transparent;outline-offset:1px;border-radius:2px;}
html body .qnum.active,html body .qnum.hover{outline:2px solid #2979c8;outline-offset:1px;border-radius:2px;}
html body .td-r{width:42px;text-align:center;vertical-align:top;border-right:1px solid #000;padding:0;background:#fff;}
html body .td-r:last-child{border-right:none;}
html body .radio-lbl{display:flex;justify-content:center;align-items:flex-start;padding-top:12px;padding-bottom:12px;width:100%;cursor:pointer;}
html body .radio-lbl input[type=radio]{display:none;}
html body .radio-circ{width:14px;height:14px;border:1.5px solid #999;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .12s;background:#fff;}
html body .radio-lbl input[type=radio]:checked ~ .radio-circ{border-color:#1565c0;background:#1565c0;}
html body .radio-lbl input[type=radio]:checked ~ .radio-circ::after{content:'';width:5px;height:5px;background:#fff;border-radius:50%;}
html body .summ-title{font-weight:700;font-size:16px;text-align:center;color:#000;margin-top:20px;margin-bottom:22px;}
html body .summ-body{font-size:16px;line-height:1.5;color:#111;text-align:left;padding-right:8px;font-family:Arial,Helvetica,sans-serif;}
html body .ans-wrap{display:inline-block;position:relative;vertical-align:middle;margin:0 1px;}
html body .ans-wrap label{display:inline;}
html body .ans-wrap input{display:inline-block;width:170px;min-width:170px;max-width:100%;height:auto;padding:1px 8px;border:1px solid #888;border-radius:4px;background:#fff;font-family:inherit;font-size:inherit;color:#111;outline:none;vertical-align:middle;text-align:center;box-sizing:border-box;}
html body .ans-wrap input::placeholder{color:#000;font-size:inherit;font-weight:700;text-align:center;}
html body .ans-wrap input:focus,html body .ans-wrap input.active{border-color:#1565c0;box-shadow:0 0 0 1px rgba(21,101,192,0.2);}
html body .tif-question{margin-bottom:36px;}
html body .tif-stem{display:flex;align-items:baseline;gap:10px;margin-bottom:20px;font-size:16px;line-height:1.5;}
html body .tif-num{display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:#111;white-space:nowrap;flex-shrink:0;padding:2px 8px;border-radius:1px;border:2px solid transparent;background:#fff;cursor:pointer;transition:border-color .1s;min-width:58px;}
html body .tif-num.hovered{border-color:#2979c8;}
html body .tif-stmt{font-size:16px;color:#111;line-height:1.5;flex:1;}
html body .tif-options{display:flex;flex-direction:column;gap:16px;padding-left:17px;}
html body .tif-opt{display:flex;align-items:center;gap:10px;cursor:pointer;font-size:16px;color:#111;padding:3px 4px;border-radius:1px;margin-left:-4px;transition:background .1s;user-select:none;}
html body .tif-opt.selected{background:#d6eaf8;}
html body .tif-cb{width:16px;height:16px;flex-shrink:0;border:1.5px solid #999;border-radius:4px;display:flex;align-items:center;justify-content:center;background:#fff;position:relative;transition:border-color .1s,background .1s;}
html body .tif-opt:hover .tif-cb{border-color:#2979c8;}
html body .tif-opt.selected .tif-cb{background:#2979c8;border-color:#2979c8;border-radius:4px;}
html body .tif-opt.selected .tif-cb::after{content:'';position:absolute;left:50%;top:50%;width:8px;height:5px;border-left:2px solid #fff;border-bottom:2px solid #fff;transform:translate(-55%,-65%) rotate(-45deg);}
html body .tif-dot{display:inline-flex;flex-direction:column;align-items:center;background:none;border:none;cursor:pointer;padding:0;flex-shrink:0;}
html body .tif-dot::before{content:'';display:block;height:3px;width:100%;background:#cccccc;border-radius:1px;margin-bottom:12px;align-self:stretch;transition:background .15s;}
html body .tif-dot.answered::before{background:#4CAF50;}
html body .tif-dot.complete::before{background:#388e3c;}
html body .tif-dot-label{font-size:16px;color:#444;font-weight:500;padding:0 3px;line-height:1;white-space:nowrap;outline:2px solid transparent;outline-offset:1px;border-radius:1px;transition:outline-color .1s,color .1s;}
html body .tif-dot.hovered .tif-dot-label,html body .tif-dot.active .tif-dot-label{outline-color:#2979c8;color:#111;}
html body .tif-dot.active .tif-dot-label{font-weight:700;}

/* MULTIPLE CHOICE ONE / YES NO NOT GIVEN */
html body .mc-question{margin-bottom: 40px;}
html body .mc-header{display: flex; align-items: baseline; gap: 10px; margin-bottom: 23px;}
html body .mc-num{display: inline-flex; align-items: center; justify-content: center;
  min-width: 24px; height: 24px; padding: 0 5px;
  border: 2px solid transparent; border-radius: 2px;
  font-size: 16px; font-weight: 700; color: #111; flex-shrink: 0;
  cursor: pointer; transition: border-color .1s;}
html body .mc-num.active,html body .mc-num.hover{border-color: #2979c8;}
html body .mc-stmt{font-size: 16px; color: #111; line-height: 1.5; font-weight: 400;}
html body .mc-options{display: flex; flex-direction: column; gap: 23px; padding-left: 8px;}
html body .mc-opt-lbl{display: flex; align-items: baseline; gap: 10px;
  cursor: pointer; font-size: 16px; color: #111;}
html body .mc-opt-lbl input[type=radio]{display: none;}
html body .mc-radio-circ{width: 14px; height: 14px; flex-shrink: 0;
  border: 1.5px solid #999; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #fff; transition: border-color .1s; margin-top: 3px;}
html body .mc-opt-lbl:hover .mc-radio-circ{border-color: #2979c8;}
html body .mc-opt-lbl input:checked ~ .mc-radio-circ{border-color: #1565c0; background: #fff;}
html body .mc-opt-lbl input:checked ~ .mc-radio-circ::after{content: ''; width: 8px; height: 8px; background: #1565c0; border-radius: 50%;}
html body .mc-opt-letter{display: none;}
html body .ync-question{margin-bottom: 40px;}
html body .ync-header{display: flex; align-items: baseline; gap: 10px; margin-bottom: 23px;}
html body .ync-num{display: inline-flex; align-items: center; justify-content: center;
  min-width: 24px; height: 24px; padding: 0 5px;
  border: 2px solid transparent; border-radius: 2px;
  font-size: 16px; font-weight: 700; color: #111; flex-shrink: 0;
  cursor: pointer; transition: border-color .1s;}
html body .ync-num.active,html body .ync-num.hover{border-color: #2979c8;}
html body .ync-stmt{font-size: 16px; color: #111; line-height: 1.5;}
html body .ync-options{display: flex; flex-direction: column; gap: 23px; padding-left: 8px;}
html body .ync-opt-lbl{display: flex; align-items: center; gap: 10px;
  cursor: pointer; font-size: 16px; color: #111;}
html body .ync-opt-lbl input[type=radio]{display: none;}
html body .ync-radio-circ{width: 14px; height: 14px; flex-shrink: 0;
  border: 1.5px solid #999; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #fff; transition: border-color .1s;}
html body .ync-opt-lbl:hover .ync-radio-circ{border-color: #2979c8;}
html body .ync-opt-lbl input:checked ~ .ync-radio-circ{border-color: #1565c0; background: #fff;}
html body .ync-opt-lbl input:checked ~ .ync-radio-circ::after{content: ''; width: 8px; height: 8px; background: #1565c0; border-radius: 50%;}
html body .mc-opt-lbl:has(input:checked),html body .ync-opt-lbl:has(input:checked){background: #d6eaf8;
  border-radius: 3px;
  padding-left: 4px;
  margin-left: -4px;}

/* TRUE FALSE NOT GIVEN */
html body .tfng-question{margin-bottom: 28px;}
html body .tfng-header{display: flex; align-items: baseline; gap: 10px; margin-bottom: 14px;}
html body .tfng-num{display: inline-flex; align-items: center; justify-content: center;
  min-width: 22px; height: 22px; padding: 1px 4px;
  border: 2px solid transparent; border-radius: 2px;
  font-size: 16px; font-weight: 700; color: #111; flex-shrink: 0;
  cursor: pointer; transition: border-color .1s;}
html body .tfng-num.active,html body .tfng-num.hover{border-color: #2979c8;}
html body .tfng-stmt{font-size: 16px; color: #111; line-height: 1.5;}
html body .tfng-options{display: flex; flex-direction: column; gap: 14px; padding-left: 8px;}
html body .tfng-opt-lbl{display: flex; align-items: center; gap: 10px;
  cursor: pointer; font-size: 16px; color: #111;}
html body .tfng-opt-lbl input[type=radio]{display: none;}
html body .tfng-radio-circ{width: 14px; height: 14px; flex-shrink: 0;
  border: 1.5px solid #999; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  background: #fff; transition: border-color .1s;}
html body .tfng-opt-lbl:hover .tfng-radio-circ{border-color: #2979c8;}
html body .tfng-opt-lbl input:checked ~ .tfng-radio-circ{border-color: #1565c0; background: #1565c0;}
html body .tfng-opt-lbl input:checked ~ .tfng-radio-circ::after{content: ''; width: 5px; height: 5px; background: #fff; border-radius: 50%;}
html body .tfng-opt-lbl:has(input:checked){background: #d6eaf8;
  border-radius: 3px;
  padding-left: 4px;
  margin-left: -4px;}

/* MATCHING HEADINGS */
html body .mh-gap-wrap{width:534px;
  margin:0 0 6px 0;}
html body .mh-gap{width:534px;
  height:24px;
  min-height:24px;
  border:2px dashed #4b91b0;
  border-radius:4px;
  background:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  text-align:center;
  box-sizing:border-box;
  padding:0;
  font-size:16px;
  line-height:24px;
  color:#111;
  transition:border-color .12s,background .12s,box-shadow .12s;
  cursor:pointer;}
html body .mh-gap .mh-num,html body .mh-gap .gapOrderNumber{font-weight:700;
  font-size:16px;
  line-height:24px;
  color:#111;}
html body .mh-gap.drag-over{border-color:#5aa6c8;
  background:#eef6fa;
  box-shadow:none;}
html body .mh-gap.drag-invalid{background:#fff;}
html body .mh-gap.filled{width:534px;
  min-height:24px;
  height:auto;
  border:1px solid #4b91b0;
  border-radius:4px;
  background:#fff;
  cursor:grab;
  font-weight:700;
  display:flex;
  align-items:center;
  justify-content:flex-start;
  padding:4px 8px;
  line-height:1.25;}
html body .mh-gap .gapFilledText{display:block;
  width:100%;
  font-weight:700;
  font-size:16px;
  line-height:1.25;
  color:#111;
  white-space:normal;
  overflow:visible;
  text-overflow:clip;}
html body .mh-gap.filled .mh-num{display:none;}
html body .mh-bank-title{font-weight:700;
  font-size:16px;
  margin:18px 0 11px;}
html body .mh-bank{display:flex;
  flex-direction:column;
  align-items:flex-start;
  gap:12px;
  width:100%;
  min-width:0;
  margin-bottom:4px;}
html body .mh-heading{display:inline-flex;
  align-items:center;
  width:fit-content;
  max-width:100%;
  min-width:0;
  min-height:24px;
  height:auto;
  padding:2px 10px;
  border:1px solid #8b8b8b;
  border-radius:4px;
  background:#fff;
  color:#111;
  font-size:16px;
  line-height:20px;
  font-weight:700;
  cursor:grab;
  user-select:none;
  box-sizing:border-box;
  white-space:normal;
  overflow:hidden;
  overflow-wrap:break-word;
  word-break:normal;
  transition:opacity .12s,background .12s,border-color .12s,color .12s;}
html body .mh-heading:active{cursor:grabbing;}
html body .mh-heading.used{display:none;}
html body .mh-heading.mh-source-dragging{display:inline-flex;
  height:auto;
  min-height:24px;
  max-width:100%;
  color:#b9b9b9;
  border-color:#b8dbea;
  background:#fff;
  opacity:1;}
html body .mh-gap{max-width:100%;width:534px;}
html body .mh-heading .mh-heading-text{display:block;
  max-width:100%;
  min-width:0;
  white-space:normal;
  overflow-wrap:break-word;
  word-break:normal;
  line-height:20px;}

/* MATCHING SENTENCE ENDINGS / SHORT ANSWER */
html body .me-sentence{display: flex; align-items: baseline; flex-wrap: wrap;
  font-size: 16px; color: #111; line-height: 1.7;
  margin-bottom: 22px; gap: 6px;}
html body .me-text{flex-shrink: 1;}
html body .me-drop{display: inline-block; vertical-align: middle;
  min-width: 300px; width: 300px; max-width: 100%;
  height: 25px;
  padding: 0 8px;
  border: 1px solid #888; border-radius: 4px;
  background: #fff; font-family: Arial, Helvetica, sans-serif;
  font-size: 16px; color: #111; font-weight: 400;
  text-align: center; box-sizing: border-box;
  cursor: default; transition: border-color .15s, background .15s;
  white-space: nowrap; flex-shrink: 0;
  line-height: 25px;}
html body .me-drop .me-num{font-weight: 700; color: #000; font-size: 16px;}
html body .me-drop.drag-over{border-color: #2979c8; box-shadow: 0 0 0 1px rgba(21,101,192,0.2);}
html body .me-drop.filled{border-color: #888; background: #fff; font-weight: 400; width: fit-content; min-width: unset; height: auto; line-height: normal; padding: 1px 8px; cursor: pointer;}
html body .me-drop.filled .me-num{display: none;}
html body .me-endingbank{display: flex; flex-direction: column; gap: 8px;
  margin-top: 20px;}
html body .me-ending{display: inline-flex; align-items: center;
  padding: 3px 10px; width: fit-content;
  border: 1px solid #888; border-radius: 4px;
  background: #fff; font-size: 16px; color: #111;
  cursor: grab; user-select: none; transition: opacity .15s;
  font-family: Arial, Helvetica, sans-serif; white-space: nowrap;}
html body .me-ending.used{display: none;}
html body .me-ending:active{cursor: grabbing;}
html body .me-ending-label{display: none;}

/* SUMMARY DRAG AND DROP */
html body .dnd-summary-body{font-size: 16px; line-height: 1.5; color: #111;
  text-align: left; padding-right: 8px;
  font-family: Arial, Helvetica, sans-serif;
  margin-bottom: 24px;}
html body .dnd-drop{display: inline-block;
  position: relative; vertical-align: middle;
  min-width: 120px; width: 120px;
  max-width: 100%;
  height: auto;
  padding: 1px 8px;
  border: 1px solid #888; border-radius: 4px;
  background: #fff; font-family: Arial, Helvetica, sans-serif;
  font-size: 16px; color: #111; font-weight: 400;
  text-align: center; box-sizing: border-box;
  cursor: default; transition: border-color .15s, background .15s;
  margin: 0 1px;
  line-height: normal;}
html body .dnd-drop.drag-over{border-color: #2979c8; box-shadow: 0 0 0 1px rgba(21,101,192,0.2);}
html body .dnd-drop.filled{border-color: #888; background: #fff; font-weight: 400; cursor: pointer; width: fit-content; min-width: unset;}
html body .dnd-drop .dnd-num{font-weight: 700; color: #000; font-size: 16px; opacity: 1;}
html body .dnd-drop.filled .dnd-num{display: none;}
html body .dnd-wordbank{display: flex; flex-wrap: wrap; gap: 6px;
  margin-top: 18px; padding: 0;}
html body .dnd-word-label{display: none;}
html body .dnd-word{display: inline-flex; align-items: center;
  padding: 3px 8px;
  width: fit-content; min-width: unset;
  border: 1px solid #888; border-radius: 4px;
  background: #fff; font-size: 16px; color: #111;
  cursor: grab; user-select: none; transition: opacity .15s;
  font-family: Arial, Helvetica, sans-serif;
  white-space: nowrap;}
html body .dnd-word.used{display: none;}
html body .dnd-word:active{cursor: grabbing;}
html body .dnd-word-label{display: none;}

/* NOTE COMPLETION */
html body .choice-notes{padding-left:25px}
html body .choice-notes li{margin:20px 0;line-height:1.8}
html body #qpanel .choice-notes-title{text-align:center;font-size:18px;font-weight:700;line-height:1.5;margin:18px 0 14px}
html body #qpanel .choice-notes{padding-left:40px;margin:0}
html body #qpanel .choice-notes li{margin:0 0 17px;padding-left:3px;line-height:1.6}
html body #qpanel .choice-notes .choice-current{outline:none}
html body #qpanel .choice-notes .choice-current .choice-gap{border-color:#3592df}
html body .choice-question label,html body .ync-opt-lbl,html body .tfng-opt-lbl,html body .mc-opt-lbl,html body .tif-opt{box-sizing:border-box;transition:none!important}
html body #qpanel .choice-question label,html body .ync-opt-lbl,html body .tfng-opt-lbl,html body .mc-opt-lbl{display:flex;align-items:center;width:100%;max-width:none;padding:10px 12px!important;margin:0!important;min-height:44px;gap:7px}
html body .ync-options,html body .tfng-options,html body .mc-options,html body .tif-options{padding-left:0;gap:0!important}
html body #qpanel .choice-question label:hover,html body .ync-opt-lbl:hover,html body .tfng-opt-lbl:hover,html body .mc-opt-lbl:hover,html body .tif-opt:hover{background:#e4e4e4}
html body #qpanel .choice-question label:has(input:checked),html body .ync-opt-lbl:has(input:checked),html body .tfng-opt-lbl:has(input:checked),html body .mc-opt-lbl:has(input:checked),html body .tif-opt.selected{background:#bedced!important}
html body .ync-question,html body .tfng-question,html body .mc-question,html body #qpanel .choice-question{margin-bottom:40px}
html body .ync-header,html body .tfng-header,html body .mc-header,html body .choice-question-heading{gap:4px!important;margin-bottom:10px!important}
html body .ync-num,html body .tfng-num,html body .mc-num{border-radius:1px!important;border:2px solid transparent!important;min-width:28px;padding:1px 3px;cursor:pointer}
html body .ync-num.video-current,html body .tfng-num.video-current,html body .mc-num.video-current{border-color:#428eaf!important}
html body .ync-num:not(.video-current),html body .tfng-num:not(.video-current),html body .mc-num:not(.video-current){border-color:transparent!important}
html body .ync-stmt,html body .tfng-stmt,html body .mc-stmt{line-height:1.5}
html body .ync-radio-circ,html body .tfng-radio-circ,html body .mc-radio-circ{width:13px;height:13px;flex:0 0 13px;border-width:1px}
html body .ans-wrap input,html body #qpanel .choice-gap{height:23px!important;min-width:174px!important;width:174px!important;padding:0 5px!important;border:1px solid #888!important;border-radius:2px!important;line-height:21px!important;text-align:left!important;box-shadow:none!important;vertical-align:baseline!important}
html body .ans-wrap input::placeholder,html body #qpanel .choice-gap::placeholder{text-align:center!important;color:#111;font-weight:700;opacity:1}
html body .ans-wrap input:focus,html body #qpanel .choice-gap:focus{border-color:#4d99b7!important;outline:1px solid #a0cbdc!important;outline-offset:0}
html body .ans-wrap input:not(:focus){outline:none!important}
html body .mh-gap-wrap{width:100%!important;margin:0 0 4px!important}
html body .mh-gap{width:100%!important;height:46px!important;min-height:46px!important;border:1px solid #dedede!important;border-radius:2px!important;padding:0 8px!important;box-shadow:none!important;transition:none!important}
html body .mh-gap.video-current{border:1px dotted #5095b1!important;outline:1px solid #dae6eb;outline-offset:1px}
html body .mh-gap.filled{height:auto!important;min-height:24px!important;justify-content:flex-start!important;padding:1px 8px!important;border:1px solid #b8b8b8!important;font-weight:700;line-height:1.25!important}
html body .mh-gap.drag-over{background:#ddd!important;border:1px dotted #5095b1!important}
html body .mh-gap .gapFilledText{font:700 16px/1.25 Arial!important}
html body .mh-bank{gap:12px!important;align-items:flex-start!important}
html body .mh-heading{min-height:24px!important;padding:0 8px!important;border:1px solid #bbb!important;border-radius:2px!important;font:700 16px/20px Arial!important;box-shadow:0 1px 2px #0002;transition:none!important;overflow:visible!important}
html body .mh-heading.used{display:inline-flex!important;visibility:hidden;pointer-events:none}
html body .mh-heading.mh-source-dragging{display:inline-flex!important;visibility:visible!important;color:#bbb!important;pointer-events:none}
html body .mh-heading.mh-source-dragging .mh-heading-text{color:#bbb}
html body .mh-bank.drag-over{background:#e1e1e1}
html body .mh-gap-wrap{width:534px!important;max-width:100%;margin:0 0 6px!important}
html body .mh-gap:not(.filled){width:534px!important;max-width:100%;height:24px!important;min-height:24px!important;border:2px dashed #4b91b0!important;border-radius:4px!important;padding:0!important;outline:none!important;line-height:24px!important;background:#fff!important}
html body .mh-gap:not(.filled).drag-over{border-color:#5aa6c8!important;background:#eef6fa!important}
/* NUMBERED INPUTS — shared by summary, notes, short answers and diagram. */
html body #qpanel .choice-gap,html body .ans-wrap input,html body .note-ans-wrap input{display:inline-block;box-sizing:border-box;font:16px/21px Arial!important;color:#111;background:#fff;height:23px!important;width:174px!important;min-width:174px!important;max-width:100%;padding:0 5px!important;border:1px solid #888!important;border-radius:2px!important;text-align:left!important;vertical-align:baseline!important;box-shadow:none!important}
html body #qpanel .choice-gap::placeholder,html body .ans-wrap input::placeholder,html body .note-ans-wrap input::placeholder{font-weight:700;color:#111;opacity:1;text-align:center!important}
html body #qpanel .choice-gap:focus,html body .ans-wrap input:focus,html body .note-ans-wrap input:focus{border-color:#4d99b7!important;outline:1px solid #a0cbdc!important}
html body #qpanel .tfng-opt-lbl input[type=radio],html body .ync-opt-lbl input[type=radio],html body .mc-opt-lbl input[type=radio]{display:none!important}
html body .me-sentence{display:flex;align-items:baseline;flex-wrap:wrap;font:16px/1.7 Arial;gap:6px;margin-bottom:22px}
html body .me-drop{min-width:min(300px,100%)!important;max-width:100%;white-space:normal;overflow-wrap:break-word}
/* DIAGRAM — coordinates and artwork remain specific to each diagram. */
html body .diagram-label,html body .diagram-fixed{font:16px/1.45 Arial;white-space:normal;box-sizing:border-box;overflow-wrap:normal}
html body #qpanel .diagram-label .choice-gap{max-width:100%!important;min-width:0!important}
html body .mh-gap.filled{white-space:normal!important;overflow-wrap:break-word}
html body .dnd-word,html body .me-ending{max-width:100%;white-space:normal;overflow-wrap:break-word}

/* Choose TWO: retain the original Goya spacing rather than single-choice spacing. */
html body #qpanel .tif-options{gap:16px!important;padding-left:17px!important}
html body #qpanel .tif-opt{padding:3px 4px!important;margin-left:-4px!important;gap:10px!important;line-height:1.5;min-height:0}
/* Word-bank tokens keep their own height instead of stretching to the bank. */
html body .dnd-wordbank{align-items:flex-start!important}
html body .dnd-word{align-self:flex-start!important;font:16px/20px Arial!important;padding:3px 8px!important;height:auto!important;min-height:0!important}

/* Empty headings contain only the centred question number. */
html body .mh-gap:not(.filled){display:flex!important;align-items:center!important;justify-content:center!important;text-align:center!important}
html body .mh-gap:not(.filled) .gapFilledText{display:none!important}
html body .mh-gap:not(.filled) .gapOrderNumber{margin:0!important;line-height:20px!important}
/* Choose TWO uses the same full-row hit/highlight area as TFNG. */
html body #qpanel .tif-options{padding-left:0!important}
html body #qpanel .tif-opt{display:flex;align-items:center;box-sizing:border-box;width:100%;max-width:none;min-height:44px!important;padding:10px 12px!important;margin:0!important;gap:7px!important;border-radius:0}
html body #qpanel .tif-opt:hover{background:#e4e4e4}
html body #qpanel .tif-opt.selected{background:#bedced!important}

/* Choose TWO — exact native-checkbox structure/styles from John Ray. */
html body .choiceInteraction__choiceInteraction___QMm1T{
  width:100%;
  margin:22px 0 34px;
}
html body .choiceInteraction__promptAndButtonRow___Di3-N{
  width:100%;
}
html body .interaction-prompt.rich-text-prompt{
  display:flex;
  align-items:baseline;
  gap:10px;
  margin:0 0 18px;
  font-size:16px;
  line-height:1.5;
  color:#111;
}
html body .order-number.active{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-width:58px;
  padding:3px 8px;
  border:2px solid #2979c8;
  border-radius:2px;
  background:#fff;
  color:#111;
  font-size:16px;
  font-weight:700;
  line-height:1.5;
  box-sizing:border-box;
  flex:0 0 auto;
}
html body .interaction-prompt .text{
  flex:1;
  font-size:16px;
  color:#111;
  line-height:1.5;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical{
  list-style:none;
  margin:0;
  padding:0;
  display:flex;
  flex-direction:column;
  width:100%;
  gap:0;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li{
  position:relative;
  width:100%;
  min-height:56px;
  display:flex;
  align-items:center;
  margin:0;
  padding:0;
  box-sizing:border-box;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li input[type="checkbox"]{
  position:absolute;
  opacity:0;
  pointer-events:none;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li label.text{
  width:100%;
  min-height:56px;
  display:flex;
  align-items:center;
  gap:10px;
  box-sizing:border-box;
  padding:11px 16px;
  margin:0;
  cursor:pointer;
  font-size:16px;
  line-height:1.5;
  color:#111;
  border-radius:1px;
  transition:background .08s;
  user-select:none;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li label.text::before{
  content:'';
  width:16px;
  height:16px;
  flex:0 0 16px;
  box-sizing:border-box;
  border:1.5px solid #999;
  border-radius:4px;
  background:#fff;
  position:relative;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li label.text:hover{
  background:#f7f7f7;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li label.text:hover::before{
  border-color:#2979c8;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li input[type="checkbox"]:checked + label.text{
  background:#c6dfef;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li input[type="checkbox"]:checked + label.text:hover{
  background:#c6dfef;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li input[type="checkbox"]:checked + label.text::before{
  background:#1f78c1;
  border-color:#1f78c1;
}
html body .choiceInteraction__choiceInteraction___QMm1T ul.vertical li input[type="checkbox"]:checked + label.text::after{
  content:'';
  position:absolute;
  left:24px;
  top:50%;
  width:8px;
  height:5px;
  border-left:2px solid #fff;
  border-bottom:2px solid #fff;
  transform:translate(-50%,-65%) rotate(-45deg);
  pointer-events:none;
}
html body .choiceInteraction__choiceInteraction___QMm1T input:disabled + label.text{color:#aaa;cursor:default}
html body .choiceInteraction__choiceInteraction___QMm1T input:disabled + label.text::before{border-color:#d5d5d5}
html body #qpanel .tif-options{gap:0!important;padding-left:0!important}
html body #qpanel .tif-opt{position:relative;min-height:56px!important;padding:11px 16px!important;gap:10px!important}
html body #qpanel .tif-opt:hover{background:#f7f7f7}
html body #qpanel .tif-opt.selected{background:#c6dfef!important}
html body #qpanel .tif-cb{width:16px;height:16px;flex:0 0 16px}
html body #qpanel .tif-opt.selected .tif-cb{background:#1f78c1;border-color:#1f78c1}

/* Spinning Jenny captions sit directly on the page; answer inputs keep their own borders/background. */
html body .jenny-diagram .diagram-label,html body .jenny-diagram .diagram-fixed{background:transparent!important}

/* SOURCE NOTES: preserve PDF heading weight and hanging indentation. */
html body #qpanel .source-notes{font:16px/1.75 Arial;padding:0;margin:0}
html body #qpanel .source-note-row{position:relative;margin-bottom:0;min-width:0}
html body #qpanel .source-note-bullet{padding-left:var(--note-hanging,1em)}
html body #qpanel .source-note-marker{position:absolute;left:0;top:0;font-weight:400}
html body #qpanel .source-note-text{display:block;text-indent:var(--note-first-line,0);font-weight:400;overflow-wrap:break-word}
html body #qpanel .source-note-text strong{font-weight:700}
html body #qpanel .source-note-columns{display:grid;grid-template-columns:var(--note-label-width) minmax(0,1fr);align-items:start}
html body #qpanel .source-note-columns .source-note-label{white-space:nowrap}
/* Matching Names uses the reference matrix and a separate labelled name list. */
html body #qpanel .researchers{border:1.1px solid #000;margin-top:12px;font-size:16px;display:inline-block;min-width:175px;background:#fff}
html body #qpanel .researchers-hdr{font-weight:700;padding:8px 10px 30px;border-bottom:1.1px solid #000;text-align:left}
html body #qpanel .res-row{display:flex;align-items:stretch;border-bottom:1.1px solid #000}
html body #qpanel .res-row:last-child{border-bottom:none}
html body #qpanel .res-ltr{width:28px;flex-shrink:0;font-weight:700;border-right:1.1px solid #000;display:flex;align-items:center;justify-content:flex-start;padding:8px 6px;box-sizing:content-box}
html body #qpanel .res-name{padding:8px 10px;text-align:left}
.passage-para:has(+ .source-footnote){margin-bottom:0}.source-footnote{border:0;margin:12px 0 0;padding:0;font-family:inherit;font-size:14px;font-style:italic;line-height:1.5}
html body .mh-gap-wrap,html body .mh-gap,html body .mh-gap.filled{max-width:100%;}

/* FLOW-CHART COMPLETION: native text/inputs, source branches preserved. */
.flow-chart-title{font:bold 16px/1.5 Arial;text-align:center;margin:20px 0 14px}
.flow-chart-viewport{width:100%;overflow-x:auto;padding:4px 2px 12px;overscroll-behavior-x:contain}
.flow-chart{min-width:550px;width:100%;font:16px/1.4 Arial;color:#111}
.flow-chart-box{border:1px solid #888;padding:9px 10px;min-width:0;background:transparent;overflow-wrap:break-word}
.flow-chart-start{width:55%;margin:0 auto}
.flow-chart-branches{height:32px;width:100%}.flow-chart-branches svg{display:block;width:100%;height:32px}
.flow-chart-row{display:grid;grid-template-columns:minmax(0,1fr) 28px minmax(0,1fr);gap:10px;align-items:stretch}
.flow-chart-plus{display:flex;align-items:center;justify-content:center;font:bold 24px Arial}
.flow-chart-connector{height:28px}.flow-chart-connector>div{display:flex;justify-content:center;align-items:center}.flow-chart-connector svg{display:block;width:24px;height:28px}
.flow-chart .choice-gap{max-width:100%;vertical-align:baseline}

.flow-chart-branches{position:relative}.flow-chart-branches img{position:absolute;top:4px;width:22px;height:24px;object-fit:contain}.flow-chart-branches .flow-arrow-left{left:36%;transform:translateX(-50%)}.flow-chart-branches .flow-arrow-right{right:36%;transform:translateX(50%)}.flow-chart-connector img{display:block;width:22px;height:24px;object-fit:contain}

.flow-chart-shared-down img{width:24px;height:26px;top:3px}.flow-chart-shared-down .flow-arrow-left{transform:translateX(-50%) rotate(45deg)}.flow-chart-shared-down .flow-arrow-right{transform:translateX(50%) rotate(-45deg)}.flow-chart-connector img[src$="flow-arrow-user-clean.png"]{width:28px;height:28px}

/* Align selection circles to the first answer line, including wrapped options. */
html body #qpanel :is(.mc-opt-lbl,.ync-opt-lbl,.tfng-opt-lbl,.choice-question label){align-items:flex-start!important;line-height:1.5!important}
html body #qpanel :is(.mc-radio-circ,.ync-radio-circ,.tfng-radio-circ){box-sizing:border-box;width:14px!important;height:14px!important;flex:0 0 14px!important;font-size:inherit;margin:calc((1.5em - 14px)/2) 0 0!important;align-self:flex-start}
html body #qpanel .choice-question label>input[type=radio]{box-sizing:border-box;width:14px;height:14px;flex:0 0 14px;margin:calc((1.5em - 14px)/2) 0 0!important;align-self:flex-start}

/* Measured canvases: original artwork and deliberate caption lines. */
html body.zoom-exam .reviewed-diagram-viewport{min-height:0!important;height:auto!important;padding:0 0 8px!important;margin:0 0 10px!important;overflow:auto!important;scrollbar-gutter:auto}
html body .reviewed-diagram-figure{max-width:none;margin:0 auto}
html body .reviewed-diagram-figure>.diagram-title{text-align:center!important;font:700 18px/1.4 Arial!important;margin:12px 0 8px!important;padding:0}
html body.zoom-exam .reviewed-diagram-figure>.shared-diagram{width:100%!important;min-width:0!important;height:auto!important;margin:0!important;isolation:isolate}
html body .shared-diagram>.diagram-label{background:transparent!important;padding:0!important;margin:0;font:16px/30px Arial!important;white-space:nowrap!important;overflow-wrap:normal!important;box-sizing:border-box}
html body #qpanel .shared-diagram .choice-gap{width:180px!important;min-width:180px!important;max-width:none!important;height:23px!important;box-sizing:border-box;vertical-align:baseline!important}
html body .shared-diagram .dnd-drop{display:inline-flex;width:180px!important;min-width:180px!important;max-width:none!important;height:23px;min-height:23px;padding:0 5px!important;box-sizing:border-box;align-items:center;justify-content:center;vertical-align:middle;white-space:nowrap}
html body .shared-diagram .dnd-drop .sample-filled{white-space:nowrap}
html body .reviewed-diagram-viewport+.dnd-wordbank{margin-top:8px!important}

```

### `dist/zoom-layout.css`

```css
/* Browser zoom changes the CSS viewport. Keep text readable and scroll only
   diagrams/tables that require a two-dimensional layout. */
/* Prefer real local Arial; bundle a metrically compatible fallback for Android. */
@font-face{font-family:Arial;src:local('Arial'),local('ArialMT'),url('assets/fonts/LiberationSans-Regular.ttf') format('truetype');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:Arial;src:local('Arial Bold'),local('Arial-BoldMT'),url('assets/fonts/LiberationSans-Bold.ttf') format('truetype');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:Arial;src:local('Arial Italic'),local('Arial-ItalicMT'),url('assets/fonts/LiberationSans-Italic.ttf') format('truetype');font-weight:400;font-style:italic;font-display:swap}
@font-face{font-family:Arial;src:local('Arial Bold Italic'),local('Arial-BoldItalicMT'),url('assets/fonts/LiberationSans-BoldItalic.ttf') format('truetype');font-weight:700;font-style:italic;font-display:swap}
html{max-width:100%;scroll-padding-top:64px;-webkit-text-size-adjust:100%;text-size-adjust:100%}
body.zoom-exam{min-width:0}
.zoom-exam .passage,.zoom-exam .qpanel{min-width:0;overflow-wrap:break-word}
.zoom-exam .qpanel{overflow-x:auto}
.zoom-exam .passage img{max-width:100%;height:auto}
.zoom-exam .top-nav{min-height:48px;height:auto;gap:12px;flex-wrap:wrap}
.zoom-exam .nav-left,.zoom-exam .nav-icons{min-width:0;flex-wrap:wrap}
.zoom-exam .diagram-viewport{width:100%;max-width:100%;overflow-x:auto!important;overflow-y:visible;overscroll-behavior-x:contain;padding-bottom:24px;scrollbar-gutter:stable}
.zoom-exam .diagram-viewport .jenny-diagram{width:100%;min-width:700px;flex-shrink:0}
.zoom-exam .diagram-viewport .perfume-diagram{width:100%;min-width:760px;flex-shrink:0}
.zoom-exam .diagram-viewport .diagram-label{overflow-wrap:normal}
.zoom-exam .zoom-table-viewport{max-width:100%;overflow-x:auto;overscroll-behavior-x:contain;margin:0 0 12px}
.zoom-exam .zoom-table-viewport .grid-outer{min-width:620px}
.zoom-exam .zoom-table-viewport table{min-width:594px}
.zoom-exam .me-drop{min-width:min(300px,100%)!important;max-width:100%}
.zoom-exam .mh-gap.filled{white-space:normal!important;overflow-wrap:break-word}
.zoom-exam .bottom-bar .bb-top-row{overflow-x:auto;overflow-y:hidden}
#reading-home article,#reading-home .hero>*,#reading-home header>*{min-width:0;overflow-wrap:break-word}
@media (max-width: 599px){
 body.zoom-exam{height:auto!important;min-height:100vh;min-height:100dvh;overflow:auto!important;display:block!important}
 .zoom-exam .top-nav{position:sticky;top:0;z-index:10000;padding:8px 12px;background:#fff}
 .zoom-exam .main{display:block!important;overflow:visible!important;min-height:0;height:auto!important}
 .zoom-exam .passage,.zoom-exam .qpanel{width:100%!important;max-width:100%;height:auto!important;flex:none!important;overflow:visible!important;padding:12px 16px 28px!important;box-sizing:border-box}
 .zoom-exam .divider{display:none!important}
 .zoom-exam .qpanel{border-top:1px solid #ddd;padding-bottom:100px!important}
 .zoom-exam .bottom-bar{position:sticky;bottom:0;z-index:10000;width:100%;background:#fff}
 .zoom-exam .bottom-bar .bb-part{min-width:100px!important}
 .zoom-exam .bottom-bar .bb-active-part{min-width:440px!important}
 .zoom-exam .bottom-bar .exam-submit{flex-shrink:0!important}
 .zoom-exam .bottom-bar .bb-numbers-row{overflow-x:auto!important;overflow-y:hidden!important}
 .zoom-exam .nav-arrows{position:fixed!important;bottom:82px!important;right:12px!important}
 .zoom-exam .nav-btn{width:40px;height:40px}
 body.zoom-exam.exam-notes-open{padding-right:0!important}
 .zoom-exam .exam-notes{width:min(260px,80vw)}
 #reading-home main{padding:14px}
 #reading-home .hero{padding:18px}
}

/* Tablet panes remain side by side, including inside a Full Test iframe. */
@media(min-width:600px){
 .zoom-exam{height:100%;height:100dvh;overflow:hidden}
 .zoom-exam .main{display:flex!important;min-height:0;overflow:hidden}
 .zoom-exam .divider{display:block!important}
 .zoom-exam .passage,.zoom-exam .qpanel{height:auto;min-width:0;overflow-y:auto;overscroll-behavior-y:contain;-webkit-overflow-scrolling:touch}
}
.zoom-exam .divider,.zoom-exam .resize-btn{touch-action:none;-webkit-user-select:none;user-select:none}
.zoom-exam .divider{z-index:30}
.zoom-exam .touch-resizing::before{content:'';position:absolute;inset:0 -20px;touch-action:none}
@media(pointer:coarse){.zoom-exam .resize-btn{min-width:44px;min-height:44px;touch-action:none}.zoom-exam .resize-btn .fa{pointer-events:none}}

@media (max-width: 780px){#reading-home .grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (max-width: 440px){#reading-home .grid{grid-template-columns:1fr}#reading-home header{padding:16px}#reading-home .hero h2{font-size:24px}}

/* Measured canvases: original artwork and deliberate caption lines. */
html body.zoom-exam .reviewed-diagram-viewport{min-height:0!important;height:auto!important;padding:0 0 8px!important;margin:0 0 10px!important;overflow:auto!important;scrollbar-gutter:auto}
html body .reviewed-diagram-figure{max-width:none;margin:0 auto}
html body .reviewed-diagram-figure>.diagram-title{text-align:center!important;font:700 18px/1.4 Arial!important;margin:12px 0 8px!important;padding:0}
html body.zoom-exam .reviewed-diagram-figure>.shared-diagram{width:100%!important;min-width:0!important;height:auto!important;margin:0!important;isolation:isolate}
html body .shared-diagram>.diagram-label{background:transparent!important;padding:0!important;margin:0;font:16px/30px Arial!important;white-space:nowrap!important;overflow-wrap:normal!important;box-sizing:border-box}
html body #qpanel .shared-diagram .choice-gap{width:180px!important;min-width:180px!important;max-width:none!important;height:23px!important;box-sizing:border-box;vertical-align:baseline!important}
html body .shared-diagram .dnd-drop{display:inline-flex;width:180px!important;min-width:180px!important;max-width:none!important;height:23px;min-height:23px;padding:0 5px!important;box-sizing:border-box;align-items:center;justify-content:center;vertical-align:middle;white-space:nowrap}
html body .shared-diagram .dnd-drop .sample-filled{white-space:nowrap}
html body .reviewed-diagram-viewport+.dnd-wordbank{margin-top:8px!important}

```

### `dist/exam-engine.css`

```css
/* Shared interactions use the canonical sample CSS. These rules govern layout only. */
.exam-group{margin-bottom:34px}.exam-group .sec-hdr{margin-top:24px}.exam-group .sec-inst{margin-bottom:18px}
.import-table{border-collapse:collapse;width:100%;font:16px/1.5 Arial;margin:16px 0}
.import-table th,.import-table td{border:1px solid #111;padding:12px;vertical-align:top;text-align:left}
.import-table th{font-weight:700}.import-table p{margin:0 0 12px}
.exam-bullet-list{padding-left:24px}.exam-bullet-list li{margin:8px 0}
.exam-question-explain{background:white;border:1px solid #bbb;padding:6px 10px;color:#65499a;font:14px Arial;cursor:pointer;margin-top:8px}
.exam-question-explain[hidden]{display:none}
.sample-bank{min-height:48px;padding:10px!important;box-sizing:border-box}
.sample-token{touch-action:none;cursor:grab}.sample-token.used{visibility:hidden;pointer-events:none}
.sample-token.selected{outline:2px solid #2979c8}.sample-drop{touch-action:none;cursor:pointer}
.sample-drop .sample-filled{display:none}.sample-drop.filled .sample-filled{display:inline}.sample-drop.filled .sample-number{display:none}
.sample-drag-source{opacity:.38}.sample-drag-ghost{position:fixed;z-index:999999;pointer-events:none;background:white;border:1px solid #2979c8;box-shadow:0 3px 12px #0003;padding:4px 9px;font:16px Arial;max-width:450px}
.sample-drop.drag-over,.sample-bank.drag-over{background:#e1e1e1}
.mh-gap.filled .gapFilledText{display:inline!important}.mh-gap.filled{font-weight:700}
.shared-diagram{position:relative;min-width:760px!important}.shared-diagram img{position:absolute;width:100%;height:auto}
html body .shared-diagram .diagram-label{background:transparent!important;position:absolute;font:16px/1.45 Arial;padding:0}
#exam-error{padding:24px;line-height:1.6}
.exam-loading{padding:24px;color:#555}
.exam-question-anchor{display:inline}

.passage-sub{white-space:normal}.passage-para:has(+ .source-footnote){margin-bottom:0}.source-footnote{border:0;margin:12px 0 0;padding:0;font-family:inherit;font-size:14px;font-style:italic;line-height:1.5}

.passage-section-title{font-size:16px;line-height:1.5;margin:14px 0;font-weight:700}.passage-bullet{padding-left:24px;position:relative}.passage-bullet:before{content:'•';position:absolute;left:5px}

```

### `dist/exam-progress.css`

```css
/* Shared Inspera footer, measured against the supplied 1920px reference. */
.bottom-bar .bb-top-row{height:64px!important;min-height:64px!important;padding:0!important;gap:0;background:#fff!important;border:0!important}
.bottom-bar .bb-part,.bottom-bar .bb-active-part{flex:1 1 0!important;min-width:0!important;min-height:64px!important;justify-content:flex-start!important;position:relative;padding:0!important;overflow:visible!important}
.bottom-bar .bb-active-part{display:flex!important;align-items:center!important;flex-direction:row!important}
.bottom-bar .bb-numbers-row{width:100%!important;height:64px!important;box-sizing:border-box;padding:0 22px!important;overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none;align-items:center!important}
.bottom-bar .bb-active-part:has(> #bb-dots){padding-left:22px!important;box-sizing:border-box}
.bottom-bar .exam-part-label{font:700 18px Arial!important;color:#202020!important;padding:0!important;margin:0!important;white-space:nowrap}
.bottom-bar .exam-part-label>span{margin:0!important}
.bottom-bar #bb-dots,.bottom-bar .footer__subquestionWrapper{margin-left:36px!important;gap:3px!important;height:64px!important;align-items:center!important;flex-wrap:nowrap!important}
.bottom-bar .subQuestion.scorable-item,.bottom-bar .tif-dot{height:64px!important;min-width:32px!important;background:transparent!important;border:0!important;outline:none!important;box-shadow:none!important;flex-shrink:0}
.bottom-bar .bb-q-num,.bottom-bar .tif-dot-label,.bottom-bar #bb-dots button.video-plain-dot{box-sizing:border-box;font:400 18px/28px Arial!important;height:30px!important;min-width:32px!important;width:auto!important;padding:0 4px!important;border:1px solid transparent!important;border-radius:1px!important;color:#202020!important;background:transparent!important;outline:none!important;box-shadow:none!important;white-space:nowrap;cursor:pointer}
.bottom-bar .bb-q-num,.bottom-bar .tif-dot-label{display:inline-block;text-align:center}
.bottom-bar #bb-dots button[data-exam-questions*=','],.bottom-bar .exam-grouped-dot .bb-q-num,.bottom-bar .exam-grouped-dot .tif-dot-label{min-width:64px!important}
.bottom-bar .video-current .bb-q-num,.bottom-bar .video-current .tif-dot-label,.bottom-bar .subQuestion:hover .bb-q-num,.bottom-bar .tif-dot:hover .tif-dot-label,.bottom-bar .subQuestion:focus-visible .bb-q-num,.bottom-bar .tif-dot:focus-visible .tif-dot-label,.bottom-bar #bb-dots button.video-plain-dot:is(.video-current,:hover,:focus-visible){border-color:#418fc6!important;outline:1px solid #418fc6!important;outline-offset:0!important}
.bottom-bar .bb-inactive-view{height:64px!important;gap:18px!important;padding:0!important;justify-content:center!important;align-items:center!important}
.bottom-bar .bb-inactive-label{font:400 18px Arial!important;color:#202020!important}
.bottom-bar .bb-inactive-progress{font:400 18px Arial!important;color:#777!important;margin:0!important}
.bottom-bar .bb-clickable:not(.bb-active-part):hover{background:#efefef!important}
.bottom-bar .bb-clickable:is(:active,:focus-visible){outline:2px solid #418fc6!important;outline-offset:-2px!important}
.bottom-bar .exam-submit{flex:0 0 92px!important;width:92px!important;height:64px!important;border:0!important;border-radius:0!important;background:#efefef!important;color:#555!important;font:700 26px Arial!important}
.bottom-bar .subQuestion::before,.bottom-bar .tif-dot::before,.bottom-bar .video-plain-dot::before{display:none!important}
.exam-part-progress,.exam-part-progress span{height:3px!important}
.exam-part-progress{position:absolute;top:3px!important;left:3px;right:3px;gap:3px;pointer-events:none}
.exam-part-progress span{background:#d7d7d7}
.exam-part-progress span.done{background:#568c3f}
.exam-part-progress.exam-progress-aligned{display:block;overflow:hidden;left:0;right:0}
.exam-progress-aligned span{position:absolute;top:0;flex:none}
.exam-part-progress .exam-label-progress{background:#d7d7d7}
.bottom-bar .bb-part:not(.bb-active-part) .exam-part-progress{display:none}
.nav-arrows{bottom:90px!important}
@media(max-width:1250px){.bottom-bar .bb-active-part{flex:2 1 0!important}.bottom-bar .bb-numbers-row{padding:0 12px!important}.bottom-bar #bb-dots,.bottom-bar .footer__subquestionWrapper{margin-left:18px!important}.bottom-bar .bb-active-part:has(> #bb-dots){padding-left:12px!important}}
@media(max-width:800px){.bottom-bar .exam-submit{flex-basis:54px!important;width:54px!important}.bottom-bar .bb-q-num,.bottom-bar .tif-dot-label,.bottom-bar #bb-dots button.video-plain-dot,.bottom-bar .exam-part-label,.bottom-bar .bb-inactive-label,.bottom-bar .bb-inactive-progress{font-size:14px!important}.bottom-bar .bb-inactive-view{gap:8px!important}}

/* Give fourteen separate questions enough room without clipping the last one. */
@media(min-width:1251px){.bottom-bar .bb-active-part:has([data-exam-q="40"]){min-width:626px!important}}

```

### `dist/exam-behavior.css`

```css
/* Interaction and layout refinements observed in the supplied recording. */
.part-box{background:#f1f2ec;border:1px solid #e3e3df;border-radius:2px}
.passage,.qpanel{scroll-behavior:auto;overscroll-behavior:contain}
.qpanel{padding-bottom:110px}
.choice-question label,.ync-opt-lbl,.tfng-opt-lbl,.mc-opt-lbl,.tif-opt{box-sizing:border-box;transition:none!important}
#qpanel .choice-question label,.ync-opt-lbl,.tfng-opt-lbl,.mc-opt-lbl{display:flex;align-items:center;width:100%;max-width:none;padding:10px 12px!important;margin:0!important;min-height:44px;gap:7px}
.ync-options,.tfng-options,.mc-options,.tif-options{padding-left:0;gap:0!important}
#qpanel .choice-question label:hover,.ync-opt-lbl:hover,.tfng-opt-lbl:hover,.mc-opt-lbl:hover,.tif-opt:hover{background:#e4e4e4}
#qpanel .choice-question label:has(input:checked),.ync-opt-lbl:has(input:checked),.tfng-opt-lbl:has(input:checked),.mc-opt-lbl:has(input:checked),.tif-opt.selected{background:#bedced!important}
.ync-question,.tfng-question,.mc-question,#qpanel .choice-question{margin-bottom:40px}
.ync-header,.tfng-header,.mc-header,.choice-question-heading{gap:4px!important;margin-bottom:10px!important}
.ync-num,.tfng-num,.mc-num,.choice-number{border-radius:1px!important;border:2px solid transparent!important;min-width:28px;padding:1px 3px;cursor:pointer}
.ync-num.video-current,.tfng-num.video-current,.mc-num.video-current,.choice-number.video-current{border-color:#428eaf!important}
.ync-num:not(.video-current),.tfng-num:not(.video-current),.mc-num:not(.video-current),.choice-number:not(.video-current){border-color:transparent!important}
.ync-stmt,.tfng-stmt,.mc-stmt{line-height:1.5}
.ync-radio-circ,.tfng-radio-circ,.mc-radio-circ{width:13px;height:13px;flex:0 0 13px;border-width:1px}
.ans-wrap input,#qpanel .choice-gap{height:23px!important;min-width:174px!important;width:174px!important;padding:0 5px!important;border:1px solid #888!important;border-radius:2px!important;line-height:21px!important;text-align:left!important;box-shadow:none!important;vertical-align:baseline!important}
.ans-wrap input::placeholder,#qpanel .choice-gap::placeholder{text-align:center!important;color:#111;font-weight:700;opacity:1}
.ans-wrap input:focus,#qpanel .choice-gap:focus{border-color:#4d99b7!important;outline:1px solid #a0cbdc!important;outline-offset:0}
.ans-wrap input:not(:focus){outline:none!important}
.bottom-bar{background:white;flex:none}
.bb-bottom-row{display:none!important}
.bb-top-row{height:52px;min-height:52px;background:white;padding-top:0;border-bottom:0;align-items:stretch}
.bb-active-part{flex-direction:row!important;align-items:center!important;justify-content:flex-start!important}
.bb-part{position:relative}
.bb-numbers-row{align-items:center;height:52px}
.footer__questionNo{margin-left:8px!important;font-weight:700!important;color:#111}
.footer__questionNo>span{margin-top:0!important}
.footer__subquestionWrapper{height:52px;align-items:center;margin-left:18px!important;gap:3px}
.subQuestion.scorable-item,.tif-dot{height:52px;position:relative;justify-content:center}
.subQuestion.scorable-item::before,.tif-dot::before{position:absolute;top:0;left:0;right:0;height:2px;margin:0;border-radius:0}
.bb-long-dash{display:none!important}
.bb-q-num,.tif-dot-label{font-size:16px;line-height:23px;outline:none!important;border:1px solid transparent;border-radius:1px;padding:0 3px;font-weight:400!important}
.subQuestion.video-current .bb-q-num,.tif-dot.video-current .tif-dot-label{border-color:#428eaf!important}
.subQuestion:hover .bb-q-num,.tif-dot:hover .tif-dot-label{border-color:#428eaf}
#bb-dots{gap:3px!important;align-items:center}
#bb-dots button.video-plain-dot{position:relative;border:1px solid transparent;background:transparent;height:25px;width:auto;min-width:21px;padding:0 3px;font:16px Arial;color:#111;cursor:pointer}
#bb-dots button.video-plain-dot.video-current{border-color:#428eaf}
#bb-dots button.video-plain-dot::before{content:'';position:absolute;left:0;right:0;top:-14px;height:2px;background:#ccc}
#bb-dots button.video-plain-dot.answered::before{background:#4caf50}
#bb-dots button.video-plain-dot.answered{border-bottom:1px solid transparent}
.nav-arrows{bottom:72px!important;right:28px;gap:4px}
.nav-btn{width:52px;height:52px;border-radius:2px;opacity:1!important;background:#000}
.nav-btn:disabled{background:#dedede!important;cursor:default}
.nav-btn:hover:not(:disabled){background:#444}
.nav-btn svg{width:28px;height:28px;stroke-width:4px}
.bb-inactive-view{padding:12px;cursor:default}
.exam-submit{width:64px;border:0;background:#eee;color:#555;font-size:22px;cursor:pointer}
.exam-home{font:12px Arial;color:#555;text-decoration:none;align-self:center;padding:6px;white-space:nowrap}
#selection-popup{background:white!important;color:#111!important;border:1px solid #ddd;border-radius:2px!important;box-shadow:0 2px 6px #0003;padding:3px!important;gap:0}
#selection-popup .sel-btn{color:#111!important;border-radius:0;min-width:46px;padding:7px!important}
#selection-popup .sel-btn:hover{background:#e6e6e6}
#selection-popup svg{stroke:#555!important}
#selection-popup .sel-divider{background:#ddd!important}
.hl{background:#8a4f7d!important;color:white}
.exam-notes{display:none;position:fixed;right:0;top:0;bottom:0;width:260px;background:#e8e8e8;z-index:20000;font:14px Arial;overflow:auto}
.exam-notes-head{height:48px;background:white;display:flex;justify-content:space-between;align-items:center;padding:0 12px;border-bottom:1px solid #ccc}
.exam-notes-head button{border:0;background:transparent;font-size:20px;cursor:pointer;padding:8px}
.exam-note-card{background:#2842b6;color:white;margin:0 0 8px;padding:14px}
.exam-note-card p{font-size:12px;line-height:1.5;margin-bottom:12px}
.exam-note-card textarea{width:100%;background:white;color:#111;border:1px solid #bbb;padding:7px;font:14px Arial;min-height:42px;resize:vertical}
.exam-note-card button{background:none;color:white;border:0;padding:10px 0 0;cursor:pointer}
.exam-note-actions{display:flex;justify-content:flex-end;gap:16px}
.exam-notes-empty{text-align:center;padding:110px 18px 20px;color:#111}
.exam-notes-empty p{margin-top:24px;font-size:12px}
body.exam-notes-open{padding-right:260px}
body.exam-notes-open .exam-notes{display:block}
body.exam-notes-open .nav-arrows{right:288px}
@media(max-width:800px){.exam-notes{width:220px}body.exam-notes-open{padding-right:220px}body.exam-notes-open .nav-arrows{right:238px}.bb-q-num,.tif-dot-label{font-size:14px}.exam-home{display:none}}
/* A single footer: the current Part expands, the other two retain their counters. */
.bottom-bar .bb-top-row{height:58px!important;min-height:58px!important;padding:0!important;border:0!important;gap:0;background:#fff}
.bottom-bar .bb-part{flex:1 1 0!important;min-width:0;min-height:58px!important;overflow:visible!important;transition:none}
.bottom-bar .bb-active-part{flex:2 1 0!important;display:flex!important;align-items:center!important;justify-content:center!important;position:relative}
.bottom-bar .bb-numbers-row{width:auto!important;max-width:100%;height:58px!important;padding:0!important;align-items:center!important;overflow-x:auto!important;overflow-y:hidden!important}
.bottom-bar .exam-part-label{margin:0!important;padding:0 3px!important;font:700 16px Arial!important;color:#222;white-space:nowrap;flex-shrink:0}
.bottom-bar .exam-part-label>span{margin:0!important;align-items:center!important;line-height:1!important}
.bottom-bar .footer__subquestionWrapper{height:58px!important;margin-left:36px!important;gap:3px!important;display:flex!important;align-items:center!important}
.bottom-bar .bb-inactive-view{padding:0!important;gap:18px!important;font:16px Arial;color:#555;white-space:nowrap}
.bottom-bar .bb-inactive-label,.bottom-bar .bb-inactive-progress{font:16px Arial!important;color:#555}
.bottom-bar .subQuestion.scorable-item,.bottom-bar .tif-dot{height:58px!important;display:inline-flex;align-items:center;justify-content:center;padding:0!important}
.bottom-bar .bb-q-num,.bottom-bar .tif-dot-label{font:16px/24px Arial!important;padding:0 3px!important;border:1px solid transparent!important;color:#222!important;white-space:nowrap}
.bottom-bar .video-current .bb-q-num,.bottom-bar .video-current .tif-dot-label,.bottom-bar .subQuestion:hover .bb-q-num,.bottom-bar .tif-dot:hover .tif-dot-label{border-color:#4d91ac!important}
.bottom-bar .subQuestion::before,.bottom-bar .tif-dot::before,.bottom-bar .video-plain-dot::before{display:none!important}
.exam-part-progress{position:absolute;left:0;right:0;top:0;height:2px;display:flex;gap:3px;pointer-events:none}
.exam-part-progress span{flex:1;background:#d5d5d5;height:2px}
.exam-part-progress span.done{background:#568c3f}
.bottom-bar #bb-dots{display:flex!important;flex-wrap:nowrap!important;gap:3px!important;flex-shrink:0}
.bottom-bar .bb-active-part> #bb-dots{margin-left:36px}
.bottom-bar #bb-dots button.video-plain-dot{height:26px!important;min-width:21px!important;width:auto!important;border-bottom:1px solid transparent!important;line-height:24px!important}
.bottom-bar #bb-dots button.video-plain-dot.video-current,.bottom-bar #bb-dots button.video-plain-dot:hover{border:1px solid #4d91ac!important}
.bottom-bar .exam-submit{flex:0 0 84px!important;width:84px!important;height:58px;background:#f0f0f0;font-size:24px;border:0;border-radius:0;color:#555}
.nav-arrows{bottom:84px!important}
/* Matching headings keep their original list slots throughout a drag. */
.mh-gap-wrap{width:100%!important;margin:0 0 4px!important}
.mh-gap{width:100%!important;height:46px!important;min-height:46px!important;border:1px solid #dedede!important;border-radius:2px!important;padding:0 8px!important;box-shadow:none!important;transition:none!important}
.mh-gap.video-current{border:1px dotted #5095b1!important;outline:1px solid #dae6eb;outline-offset:1px}
.mh-gap.filled{height:auto!important;min-height:24px!important;justify-content:flex-start!important;padding:1px 8px!important;border:1px solid #b8b8b8!important;font-weight:700;line-height:1.25!important}
.mh-gap.drag-over{background:#ddd!important;border:1px dotted #5095b1!important}
.mh-gap .gapFilledText{font:700 16px/1.25 Arial!important}
.mh-bank{gap:12px!important;align-items:flex-start!important}
.mh-heading{min-height:24px!important;padding:0 8px!important;border:1px solid #bbb!important;border-radius:2px!important;font:700 16px/20px Arial!important;box-shadow:0 1px 2px #0002;transition:none!important;overflow:visible!important}
.mh-heading.used{display:inline-flex!important;visibility:hidden;pointer-events:none}
.mh-heading.mh-source-dragging{display:inline-flex!important;visibility:visible!important;color:#bbb!important;pointer-events:none}
.mh-heading.mh-source-dragging .mh-heading-text{color:#bbb}
.mh-bank.drag-over{background:#e1e1e1}
.mh-ghost{max-width:none!important;box-sizing:border-box;padding:1px 8px!important;border:1px solid #bbb!important;border-radius:2px!important;background:#ddd!important;color:#111!important;font:700 16px/20px Arial!important;box-shadow:none!important}
body.mh-dragging{user-select:none;cursor:grabbing}
@media(max-width:1000px){.bottom-bar .footer__subquestionWrapper,.bottom-bar .bb-active-part> #bb-dots{margin-left:12px!important}.bottom-bar .bb-inactive-view{gap:8px!important}.bottom-bar .bb-q-num,.bottom-bar .tif-dot-label,.bottom-bar .exam-part-label,.bottom-bar .bb-inactive-label,.bottom-bar .bb-inactive-progress{font-size:14px!important}.bottom-bar .exam-submit{flex-basis:54px!important;width:54px!important}}

/* Restore the original computer-test heading gaps. */
.mh-gap-wrap{width:534px!important;max-width:100%;margin:0 0 6px!important}
.mh-gap:not(.filled){width:534px!important;max-width:100%;height:24px!important;min-height:24px!important;border:2px dashed #4b91b0!important;border-radius:4px!important;padding:0!important;outline:none!important;line-height:24px!important;background:#fff!important}
.mh-gap:not(.filled).drag-over{border-color:#5aa6c8!important;background:#eef6fa!important}

```

### `dist/full-test.css`

```css
.full-test-page #full-loading{position:fixed;inset:0;z-index:1000000;background:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-family:Arial,Helvetica,sans-serif}
.full-test-page #full-loading[hidden],#full-summary[hidden]{display:none!important}
.full-loader-content{transform:translateY(45px);padding:24px;max-width:100%}
.full-spinner{width:120px;height:120px;margin:0 auto 25px;border:11px solid transparent;border-top-color:#000;border-right-color:#000;border-bottom-color:#000;border-radius:50%;animation:full-spin 1s linear infinite}
.full-loader-content h1{font-size:40px;line-height:1.2;font-weight:700;margin:0 0 42px;color:#000}
.full-loader-content>p{font-size:28px;line-height:1.4;color:#000}
@keyframes full-spin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.full-spinner{animation:none}}
.full-clock{display:flex;align-items:center;gap:12px;font-size:14px}.full-clock strong{font:700 20px Arial;font-variant-numeric:tabular-nums}.full-clock .urgent{color:#b42318}
#full-frames{position:relative;display:block;min-height:0;flex:1}
#full-frames iframe{display:block;border:0;width:100%;height:100%;background:white}#full-frames iframe[hidden]{display:none}
/* Footer geometry, question buttons and counters come from exam-behavior.css. */
.full-test-page #full-footer{overflow:visible}
.full-test-page #full-footer .bb-part{pointer-events:auto;cursor:pointer;padding:0;outline:none}
.full-test-page #full-footer .bb-part:focus-visible{outline:1px solid #4d91ac;outline-offset:-2px}
.full-test-page #full-footer .bb-numbers-row{padding:0 12px!important}
.full-test-page #full-footer #bb-dots{margin-left:36px}
.full-test-page #full-footer .exam-submit:disabled{cursor:default}
#full-summary{position:fixed;inset:0;background:#0005;display:grid;place-items:center;z-index:1000001;padding:24px}#full-summary>div{background:white;padding:28px;max-width:550px;line-height:1.6;font:16px Arial;border-radius:4px}#full-summary p{margin:16px 0;line-height:1.6}#full-summary button,#full-retry{padding:10px 16px;background:white;border:1px solid #777;font:16px Arial;cursor:pointer;margin-right:18px}
#full-load-error p{margin:24px 0 12px}#full-load-error a{font-size:16px}
@media(max-width:1000px){.full-test-page #full-footer #bb-dots{margin-left:12px}}
@media(max-width:800px){.full-loader-content h1{font-size:30px}.full-loader-content>p{font-size:22px}.full-spinner{width:92px;height:92px;border-width:8px}.full-clock span{display:none}.full-test-page .nav-icons{gap:10px}.full-test-page .nav-left{gap:12px}.full-test-page .nav-taker{display:none}}

```

### `dist/home-controls.css`

```css
#reading-home .filter-row{display:flex;align-items:center;justify-content:space-between;gap:20px;margin:24px 0 18px}#reading-home .filters{margin:0}.title-search{display:flex;align-items:center;gap:10px;margin-left:auto;white-space:nowrap}.title-search input{width:280px;max-width:100%;padding:11px 14px;border:1px solid #d5cbe5;border-radius:8px;font:inherit;background:white;color:#24202a}input:focus-visible,button:focus-visible,a:focus-visible{outline:2px solid #7451b8;outline-offset:3px}#full-test-picker{box-sizing:border-box;width:min(1000px,94vw);max-height:90vh;overflow:auto;border:0;border-radius:16px;padding:28px;color:#292333;background:#faf8fe;font:15px/1.5 Arial,sans-serif}#full-test-picker::backdrop{background:#22133299}.picker-header{display:flex;align-items:center;justify-content:space-between;gap:16px}.picker-header h2{margin:0;font-size:24px}.picker-header button{border:0;background:transparent;font-size:28px;cursor:pointer}.mode-options{display:flex;gap:16px;margin:24px 0}.mode-card{flex:1;display:flex;flex-direction:column;text-align:left;gap:6px;padding:20px;border:1px solid #d8cce9;border-radius:12px;color:#493265;background:white;text-decoration:none;font:inherit;cursor:pointer}.mode-card strong{font-size:19px}.mode-card:hover,.mode-card[aria-pressed=true]{border-color:#7451b8;background:#eee7f8}.manual-columns{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.manual-column{min-width:0}.manual-column h3{margin:0 0 12px;color:#65439c}.manual-column input{box-sizing:border-box;width:100%;padding:10px;border:1px solid #d8cce9;border-radius:8px;font:inherit}.manual-list{height:280px;overflow:auto;margin-top:12px;border:1px solid #e1d8ed;border-radius:8px;background:white}.manual-choice{display:flex;align-items:flex-start;gap:10px;padding:12px;cursor:pointer;border-bottom:1px solid #eee7f5}.manual-choice:hover{background:#f4effa}.manual-choice:has(input:checked){background:#eee4fb;color:#50327c}.manual-choice input{width:16px;height:16px;flex:0 0 16px;margin:3px 0 0;accent-color:#7451b8}.manual-choice small{display:block;color:#777;font-size:12px}.manual-empty{padding:12px;color:#777}.selected-title{font-size:13px;min-height:40px;margin:10px 0;color:#65439c}#selection-status{margin:18px 0}#start-selected-test{padding:12px 20px;background:#7451b8;color:white;border:0;border-radius:8px;font:inherit;cursor:pointer}#start-selected-test:disabled{opacity:.45;cursor:default}[hidden]{display:none!important}@media(max-width:800px){#reading-home .filter-row{flex-wrap:wrap}.title-search{width:100%;margin:0}.title-search input{flex:1;width:auto}.manual-columns{grid-template-columns:1fr}.manual-list{height:200px}.mode-options{flex-direction:column}}

```

## G. Manifest batch mới nhất
```json
{
  "count": 4,
  "parts": {
    "1": 0,
    "2": 0,
    "3": 4
  },
  "lessons": [
    {
      "job": "p3-learning-to-be-bilingual",
      "lessonId": "p3-learning-to-be-bilingual",
      "title": "Learning to be bilingual",
      "part": 3,
      "sourceId": "1pmUoxE4LrzF6QHxPzBNkTatgdlY8EOzG"
    },
    {
      "job": "p3-game-theory",
      "lessonId": "p3-game-theory",
      "title": "Game theory",
      "part": 3,
      "sourceId": "1MC26oTgvrDy4HaYTQCNmhZ-N64JVjxKt"
    },
    {
      "job": "p3-australias-megafauna-controversy",
      "lessonId": "p3-australias-megafauna-controversy",
      "title": "Australia’s Megafauna Controversy",
      "part": 3,
      "sourceId": "1FbasxQXlWb91ncguFHpTVxNBt6yJqurF"
    },
    {
      "job": "p3-is-teleworking-sustainable",
      "lessonId": "p3-is-teleworking-sustainable",
      "title": "Is Teleworking Sustainable?",
      "part": 3,
      "sourceId": "1gkSdMh0D1VbizgK0ueAXlyu6ARsFjEH5"
    }
  ]
}
```

## H. Bảy ảnh upload override — thông số giữ nguyên

Nguồn raster/crop/mask/caption positions dưới đây đã gắn với hash. Không vẽ lại mũi tên hay dùng SVG để thay. Dữ liệu dùng làm reference, không phải tự động approval cho thay đổi mới.
```json
{
  "p1-the-treadle-pump": {
    "sourceAsset": "import/diagram-upload-sources/130634.png",
    "sourceId": "file_0000000044e8820bac788dd724447320",
    "uploadedName": "130634.png",
    "sourceSHA256": "b26899fa36a27b9568bd93a5d0f1a94ea74b77153179b1347cb2c1cd34311898",
    "nativeSize": [
      1536,
      705
    ],
    "crop": [
      0,
      0,
      1536,
      705
    ],
    "masks": [
      [
        15,
        12,
        379,
        145
      ],
      [
        1173,
        15,
        1518,
        108
      ],
      [
        1173,
        230,
        1526,
        406
      ],
      [
        1172,
        480,
        1526,
        616
      ],
      [
        20,
        479,
        360,
        609
      ]
    ],
    "labels": [
      {
        "text": "Operator able to work for\n{{7}} before stopping",
        "sx": 375,
        "sy": 27,
        "anchor": "end",
        "dx": -12,
        "dy": 0
      },
      {
        "text": "Support structures\nmade of {{8}}",
        "sx": 1180,
        "sy": 30,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "Pump has {{9}}\nand pistons that are\nlinked together",
        "sx": 1215,
        "sy": 240,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "Water is pumped from\nas far down as {{10}}",
        "sx": 1200,
        "sy": 490,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "Treadles are moved up and\ndown by stepping motion",
        "sx": 327,
        "sy": 490,
        "anchor": "end",
        "dx": -12,
        "dy": 0
      }
    ],
    "displayArtWidth": 900,
    "retainedRasterCaptions": []
  },
  "p1-the-olympic-torch-chua-rep": {
    "sourceAsset": "import/diagram-upload-sources/130635.png",
    "sourceId": "file_0000000079b4820ba8aeb15d3445b90d",
    "uploadedName": "130635.png",
    "sourceSHA256": "83ea77569bdb480cc2b7cce7ae8a4bc8e5cbefecf62289c06b383a8074bc565e",
    "nativeSize": [
      1536,
      1024
    ],
    "crop": [
      0,
      0,
      1536,
      1024
    ],
    "masks": [
      [
        33,
        184,
        283,
        226
      ],
      [
        830,
        26,
        1175,
        181
      ],
      [
        832,
        263,
        1135,
        338
      ],
      [
        832,
        448,
        1173,
        526
      ],
      [
        830,
        574,
        1175,
        734
      ],
      [
        34,
        701,
        343,
        780
      ]
    ],
    "labels": [
      {
        "text": "Burner with a\ndouble flame to\nwithstand windy\nconditions",
        "sx": 835,
        "sy": 35,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "A {{10}}",
        "sx": 280,
        "sy": 215,
        "anchor": "end",
        "dx": -12,
        "dy": -15
      },
      {
        "text": "Fuel in the form of a\n{{11}}",
        "sx": 840,
        "sy": 270,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "Brass valve with many\nsmall {{12}}",
        "sx": 840,
        "sy": 454,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "Combination of\n{{13}}\nand\n{{13:1}}\nstored as liquid",
        "sx": 840,
        "sy": 600,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "Propylene stored as\nliquid fuel",
        "sx": 340,
        "sy": 709,
        "anchor": "end",
        "dx": -12,
        "dy": 0
      }
    ],
    "displayArtWidth": 1000,
    "retainedRasterCaptions": [
      "1996 Atlanta Olympics torch (final version)",
      "2000 Sydney Olympics torch"
    ],
    "protectLines": [
      [
        [
          1047,
          53
        ],
        [
          1327,
          240
        ]
      ],
      [
        [
          1115,
          641
        ],
        [
          1338,
          641
        ]
      ]
    ]
  },
  "p3-termite-mounds": {
    "sourceAsset": "import/diagram-upload-sources/130636.png",
    "sourceId": "file_00000000a20881fdb8a455d45c070af4",
    "uploadedName": "130636.png",
    "sourceSHA256": "086107aedd1e9c48c07982f1bd79359c0946b117abaf668d087f466bfafeed6e",
    "nativeSize": [
      1536,
      768
    ],
    "crop": [
      0,
      0,
      1536,
      768
    ],
    "masks": [
      [
        29,
        22,
        375,
        110
      ],
      [
        29,
        267,
        360,
        386
      ],
      [
        23,
        570,
        384,
        696
      ],
      [
        1161,
        147,
        1526,
        500
      ]
    ],
    "labels": [
      {
        "text": "Top of the mound permits\n{{37}}",
        "sx": 375,
        "sy": 30,
        "anchor": "end",
        "dx": -12,
        "dy": 0
      },
      {
        "text": "Innermost chamber\ncontaining termites’ nest",
        "sx": 365,
        "sy": 275,
        "anchor": "end",
        "dx": -12,
        "dy": 0
      },
      {
        "text": "Cellar to aid control of\n{{36}}\nlevels in mound",
        "sx": 380,
        "sy": 575,
        "anchor": "end",
        "dx": -12,
        "dy": 0
      },
      {
        "text": "Network of\n{{34}}\nhelps to give the termites\na constant {{35}}\nsupply and to maintain a\nlimited temperature range",
        "sx": 1170,
        "sy": 154,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      }
    ],
    "displayArtWidth": 900,
    "retainedRasterCaptions": []
  },
  "p1-ancient-greek-coins": {
    "sourceAsset": "import/diagram-upload-sources/130637.png",
    "sourceId": "file_00000000930c820ebec37b233742ff69",
    "uploadedName": "130637.png",
    "sourceSHA256": "653bbfdd9b62a98c6954901e8aa43c4713034d047fac4922037f0543998340d1",
    "nativeSize": [
      1536,
      1024
    ],
    "crop": [
      0,
      110,
      1536,
      1024
    ],
    "masks": [
      [
        20,
        466,
        390,
        504
      ],
      [
        20,
        507,
        281,
        547
      ],
      [
        180,
        762,
        399,
        806
      ],
      [
        1267,
        467,
        1482,
        520
      ],
      [
        1268,
        803,
        1498,
        854
      ],
      [
        280,
        918,
        504,
        964
      ]
    ],
    "labels": [
      {
        "text": "Piece of metal known as\n{{8}}",
        "sx": 360,
        "sy": 470,
        "anchor": "end",
        "dx": -12,
        "dy": 0
      },
      {
        "text": "Obverse die",
        "sx": 405,
        "sy": 779,
        "anchor": "end",
        "dx": -12,
        "dy": -15
      },
      {
        "text": "{{7}}",
        "sx": 1275,
        "sy": 490,
        "anchor": "start",
        "dx": 0,
        "dy": -15
      },
      {
        "text": "{{9}}",
        "sx": 1275,
        "sy": 817,
        "anchor": "start",
        "dx": 0,
        "dy": -15
      },
      {
        "text": "{{10}}",
        "sx": 510,
        "sy": 938,
        "anchor": "end",
        "dx": -12,
        "dy": -15
      }
    ],
    "displayArtWidth": 900,
    "retainedRasterCaptions": []
  },
  "p3-movement-underwater": {
    "sourceAsset": "import/diagram-upload-sources/130650.png",
    "sourceId": "file_00000000a25c82068af2cbb5214c892d",
    "uploadedName": "130650.png",
    "sourceSHA256": "80f74314813ff9b79a9f99c6b0a9c378cf59da812c0d0a58299313d9085b0934",
    "nativeSize": [
      1536,
      1108
    ],
    "crop": [
      0,
      0,
      1536,
      1108
    ],
    "masks": [
      [
        466,
        20,
        1175,
        104
      ],
      [
        1275,
        150,
        1528,
        371
      ],
      [
        1250,
        475,
        1528,
        630
      ],
      [
        548,
        540,
        1145,
        579
      ],
      [
        50,
        526,
        282,
        566
      ],
      [
        50,
        568,
        435,
        610
      ],
      [
        152,
        671,
        579,
        753
      ],
      [
        800,
        996,
        1400,
        1078
      ]
    ],
    "labels": [
      {
        "text": "streamlined shape narrowing towards rear to reduce\n{{36}} drag",
        "sx": 472,
        "sy": 30,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "ideal tail fin shape\nfor steady movement\nknown as cruising",
        "sx": 1280,
        "sy": 155,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "slime-covered scales\nto minimise surface\nfriction",
        "sx": 1254,
        "sy": 487,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "fin controlling {{37}}\nmovement",
        "sx": 554,
        "sy": 538,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "fins controlling\n{{38}} movement",
        "sx": 57,
        "sy": 525,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "fins which are important for\n{{39}} of fish",
        "sx": 158,
        "sy": 681,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "Minimal cross-sectional body area:\nto decrease {{40}} drag",
        "sx": 808,
        "sy": 1006,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      }
    ],
    "displayArtWidth": 900,
    "retainedRasterCaptions": []
  },
  "p2-roller-coaster-the-great-fairground-attraction": {
    "sourceAsset": "import/diagram-upload-sources/130649.png",
    "sourceId": "file_000000009a9081f4bb1d6b9b3312fd0a",
    "uploadedName": "130649.png",
    "sourceSHA256": "938a9925968548cee5352654ee86fa2b546b6fc42a0869a35bc49db2eda3c192",
    "nativeSize": [
      1536,
      1024
    ],
    "crop": [
      0,
      0,
      1536,
      1024
    ],
    "masks": [
      [
        150,
        80,
        254,
        116
      ],
      [
        710,
        20,
        820,
        60
      ],
      [
        82,
        370,
        198,
        412
      ],
      [
        1236,
        591,
        1468,
        634
      ],
      [
        1195,
        825,
        1435,
        866
      ],
      [
        183,
        716,
        369,
        758
      ],
      [
        245,
        970,
        515,
        1009
      ]
    ],
    "labels": [
      {
        "text": "lift hill",
        "sx": 156,
        "sy": 87,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "tracks",
        "sx": 760,
        "sy": 26,
        "anchor": "center",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "START",
        "sx": 88,
        "sy": 378,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "lifting mechanism",
        "sx": 253,
        "sy": 977,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "{{14}}",
        "sx": 1240,
        "sy": 615,
        "anchor": "start",
        "dx": 0,
        "dy": -15
      },
      {
        "text": "{{15}}",
        "sx": 1205,
        "sy": 844,
        "anchor": "start",
        "dx": 0,
        "dy": -15
      },
      {
        "text": "{{16}}",
        "sx": 365,
        "sy": 738,
        "anchor": "end",
        "dx": -12,
        "dy": -15
      }
    ],
    "displayArtWidth": 900,
    "retainedRasterCaptions": []
  },
  "p1-tikopia": {
    "sourceAsset": "import/diagram-upload-sources/130653.png",
    "sourceId": "file_00000000c6a48209bc89a3e42d741130",
    "uploadedName": "130653.png",
    "sourceSHA256": "9131f89b14df95daa3730d3e82bc9503c4a2f384ec774a12daf072a9d4fafdd4",
    "nativeSize": [
      1536,
      1399
    ],
    "crop": [
      0,
      100,
      1536,
      1265
    ],
    "masks": [
      [
        110,
        184,
        460,
        225
      ],
      [
        110,
        225,
        266,
        266
      ],
      [
        1136,
        284,
        1465,
        362
      ],
      [
        110,
        350,
        360,
        388
      ],
      [
        110,
        390,
        323,
        433
      ],
      [
        710,
        638,
        860,
        690
      ],
      [
        790,
        720,
        1435,
        767
      ],
      [
        800,
        980,
        1430,
        1024
      ],
      [
        100,
        1200,
        740,
        1240
      ]
    ],
    "labels": [
      {
        "text": "{{5}} is collected\nfrom here",
        "sx": 115,
        "sy": 190,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "bowl made from a\n{{7}}",
        "sx": 315,
        "sy": 350,
        "anchor": "end",
        "dx": -12,
        "dy": 0
      },
      {
        "text": "hard {{6}}\nof sap",
        "sx": 1145,
        "sy": 290,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "Chisel",
        "sx": 780,
        "sy": 647,
        "anchor": "center",
        "dx": 0,
        "dy": 0,
        "title": true
      },
      {
        "text": "lengths of bark taken from fau tree",
        "sx": 792,
        "sy": 728,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "blade made from katoko’s\n{{8}}",
        "sx": 805,
        "sy": 989,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      },
      {
        "text": "made from the {{9}} of a small tree",
        "sx": 106,
        "sy": 1205,
        "anchor": "start",
        "dx": 0,
        "dy": 0
      }
    ],
    "displayArtWidth": 900,
    "retainedRasterCaptions": [],
    "paperNormalization": "local-paper",
    "paperCutoff": 48
  }
}

```

## I. Checklist ngắn trước khi kết thúc lượt nhập

- [ ] Đúng site/project, đúng source và chưa trùng nội dung; ngoại lệ Voynich được giữ.
- [ ] PDF đủ reading/task, không mất subtitle/footnote/cột/đoạn.
- [ ] Notes/table đúng bold/indent/rows; instructions đúng limits/reuse và không below/answer-sheet.
- [ ] MC/drag không letters giấy; matrix giữ letters cần thiết; headingexample đúng.
- [ ] Diagram không che arrow/label, không gap thừa, upload overrides không revert; Tikopia hai title đậm.
- [ ] Controls/drag return/restore/submission/progress/fulltest phù hợp; tests liên quan pass.
- [ ] Catalog A–Z, cover thật, practice không key/score giả.
- [ ] Manifest/source-review/jobs/triage đã lưu; no credentials.
- [ ] Đúng commit/archive được save và deploy succeeded; mới báo đã đăng.

