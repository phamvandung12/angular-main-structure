# ɵ LƯU Ý ĐỐI VỚI CODER

## A. Khi thực hiện task

1. Checkout qua `master`: `git checkout master`
2. Pull code mới nhất về: `git pull origin master`
3. Tạo một nhánh mới từ `master`, cú pháp **<author>-<IdTask>** : `git checkout -b myname-task-1`
4. Tiến hành code
5. Sau khi code xong, commit code theo lưu ý (xem Phần B)
6. Pull code mới nhất về ngay sau khi commit xong: `git pull origin master`
7. Fix conflict nếu có (xem phần C), sau đó commit lại
8. Push code của bạn lên: `git push -u origin <tên-nhánh>`
9. Tạo Merge request, điền thông tin ngắn gọn dễ hiểu về chức năng đã làm
10. Trong khi chờ kết quả review code (xem phần D), quay lại bước 1 và làm tiếp task mới

## B. Lưu ý khi commit code

1. Tên commit cần đúng định dạng: `<type>: <subject>`
2. Các `type` được phép gồm: `"create", "update", "delete", "init", "fix", "test", "upgrade", "rollback"`
3. KHÔNG ghi commit message chung chung kiểu `update`, `fix`,...
4. Bạn cần ghi rõ nội dung vừa thực hiện trong commit này, ví dụ `create: form học hàm`, `fix: chọn học hàm`, `update: form học hàm`

## C. Lưu ý khi fix conlict

1. Bạn cần xem kỹ code "Current changes" và "Incoming changes" để quyết định xem giữ phần nào, bỏ phần nào, hay lấy cả hai
2. Hãy thảo luận với người làm task conflict hoặc hói leader nếu không chắc
3. CẨN THẬN MẤT CODE!!!!

## D. Lưu ý sau khi có kết quả review code

1. Trường hợp 1: Ổn áp

- Code tốt, sẽ được merge, ờ mây dìn gút chóp!

2. Trường hợp 2: Cần fix vài chỗ và bạn CHƯA LÀM TASK KHÁC

- Trở lại nhánh của task đó: `git checkout <tên-nhánh>`
- Code có comment tại một số chỗ hoặc/và comment trên toàn bộ commit, các bạn xem comment và sửa lại
- Commit (Amend) để gộp commit này với commit trước đó:
  - Trên giao diện VSCode, mở `Source control`
  - Bấm dấu (+) bên phải chữ `Changes` để add tất cả các file đã thay đổi vào commit
  - Chọn Menu (•••) → Chọn Commit > Commit (Amend)
  - Trình soạn thảo text hiện ra
  - Gõ / Edit lại commit message
  - Bấm dấu Tick góc trên bên phải của Trình soạn thảo → Hoàn tất
- Push commit của bạn lên: `git push`
- Nếu Merge request bị close thì bạn tạo lại Merge request mới

3. Trường hợp 3: Cần fix vài chỗ và bạn ĐANG LÀM TASK KHÁC

- Lưu tất cả code đang làm lại
- Bấm dấu (+) bên phải chữ `Changes` để add tất cả các file đã thay đổi vào commit
- Commit stash (Lưu tạm code đang làm):
  - Trên giao diện VSCode, mở `Source control`
  - Chọn Menu (•••) → Chọn Stash > Stash
  - Nhập commit message vào ô input hiện ra (nhập sao để mình nhớ là được)
  - Code đã được lưu lại
- Tiếp tục fix code theo các bước ở "Trường hợp 2"
- Fix code xong quay lại nhánh task mới và apply code đã lưu lại
  - Trên giao diện VSCode, mở `Source control`
  - Chọn Menu (•••) → Chọn Stash > Pop stash...
  - Chọn mục đã lưu từ trước, code sẽ được apply vào và Stash sẽ bị xóa
  - Ngoài ra còn có: "Apply Stash" sẽ apply mà không xóa stash; "Drop Stash" sẽ xóa stash mà không appy

## E. Các lưu ý khác

1. KHÔNG đặt các file model, service lung tung. Bạn nên hỏi leader trước khi tạo file để tránh thay đổi về sau.
2. Copy code nhớ đọc lại và chỉnh sửa, đừng bê nguyên cái tên function rồi để nguyên như thế nhé!
3. Code được copy có thể code-style sẽ khác so với code hiện tại, nhớ sửa lại nhé!
4. Cuối ngày nên push code mình đang làm lên (kể cả đang làm dở) để leader theo dõi tiến độ nhé! Push thôi không cần merge requets.
5. Cần chú ý đến code style, Phải dặn lòng "KHÔNG ĐƯỢC ẨU", vì những dòng code sạch đẹp 😂
6. Nếu có thể, bạn nên suy nghĩ cách optimize code từ những chuyện nhỏ nhất.
7. Code của bạn cần phải pass linting trước khi merge request, chạy lệnh: `ng lint`

## F. Khi có thắc mắc

1. Nếu bạn là người mới: Bạn có thể vừa tự Google và hỏi Leader xem như thế có được không,...
2. Nếu bạn đã có kinh nghiệm thì `ờ mây dìn gút chóp` 😂
3. Bạn cũng có thể thảo luận nhóm nếu cần thiết.

## G. Phụ lục

1. Documentation
   https://drive.google.com/drive/folders/16e8VYxXdmvEUIWlxOd5mpMEyE_040-f9?usp=sharing

1. NG-ANT-DESIGN (Zorro) (Using version same with Angular version)
   https://ng.ant.design

1. Config for using TailwindCSS

   - https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss
   - Config IDE for Tailwind: https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss#recommended-vs-code-settings (Recommended setting and "tailwindCSS.includeLanguages")
   - CSS to Tailwind online: https://transform.tools/css-to-tailwind

1. Languages management sofware:

   - Link: https://www.codeandweb.com/babeledit/download/2.9.2/win-64
   - Trial reset: https://gist.github.com/Fusseldieb/a4ca4c2f2c736b55fe4879c61cab4de0
   - Block in hosts: `127.0.0.1 secure.codeandweb.com`
   - Remove key (Win): `HKEY_CURRENT_USER\Software\code-and-web.de\BabelEdit\licensing`
   - Click `Try BabelEdit`
   - Enter: `PHBsaXN0IHZlcnNpb249IjEuMCI+CiAgICA8ZGljdD4KICAgICAgICA8a2V5PmFjdGl2YXRlZENvbXB1dGVyczwva2V5PgogICAgICAgIDxpbnRlZ2VyPjE8L2ludGVnZXI+CiAgICAgICAgPGtleT5udW1BY3RpdmF0aW9uczwva2V5PgogICAgICAgIDxpbnRlZ2VyPjE8L2ludGVnZXI+CiAgICAgICAgPGtleT5saWNlbnNlZTwva2V5PgogICAgICAgIDxzdHJpbmc+RnJlZSBXb3JsZCBVc2VyPC9zdHJpbmc+CiAgICAgICAgPGtleT5tYXhBY3RpdmF0aW9uczwva2V5PgogICAgICAgIDxpbnRlZ2VyPjE8L2ludGVnZXI+CiAgICAgICAgPGtleT5mcmVlVXBkYXRlc1VudGlsPC9rZXk+CiAgICAgICAgPHN0cmluZz4yOTk5LTAxLTAxPC9zdHJpbmc+CiAgICAgICAgPGtleT5leHBpcnlEYXRlPC9rZXk+CiAgICAgICAgPHN0cmluZz5ub25lPC9zdHJpbmc+CiAgICAgICAgPGtleT5jb21wdXRlcklkPC9rZXk+CiAgICAgICAgPHN0cmluZz48L3N0cmluZz4KICAgICAgICA8a2V5PnByb2R1Y3Q8L2tleT4KICAgICAgICA8c3RyaW5nPkJhYmVsRWRpdDwvc3RyaW5nPgogICAgICAgIDxrZXk+bGljZW5zZVR5cGU8L2tleT4KICAgICAgICA8c3RyaW5nPnZvbHVtZTwvc3RyaW5nPgogICAgPC9kaWN0Pgo8L3BsaXN0Pg==`

1. Unit test only 1 comp:

- run `ng test --include='<pattern>'`
- Eg. `ng test --include='**/login.component.spec.ts'` will test all file named 'login.component.spec.ts'

1. Testing code coverage

- `ng test --code-coverage`

1. Husky error: hook was ignored because it's not set as executable

- Run `chmod ug+x .husky/*`
- Run `npx husky init`

1. Config VS Code for auto remove unused imports:

- Add a setting to setting.json

* Ctrl + Shift + P
* Type: "setting.json"
* Select: "Preferences: Open User Settings (JSON)"
* Add (or create if not exist):
  "editor.codeActionsOnSave" > "source.organizeImports": true

1. Fast get info documentation generated by compodoc.app (run in DevTool)

Open module page (http://localhost:8080/modules.html) and run code in file: `extract-comp.js.txt`

1. Checking EsLint Rules: npx @eslint/config-inspector

1. SEO support

- Link video: https://www.youtube.com/watch?v=y1UzfahXfao
- Timeline: 3:40 - 5:25 - 6:16 - 7:42

1. Plan to use jQuery in NodeJs Server? Try `https://github.com/cheeriojs/cheerio`
