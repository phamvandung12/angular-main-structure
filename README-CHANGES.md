# ɵ LƯU Ý KHI UPDATE VERSION

> Version hiện tại: 19

## Các tính năng cần chú ý khi nâng cấp phiên bản tiếp theo

> Kiểm tra trạng thái stable, migrate nếu khả dụng

- Signals

> Kiểm tra bug của 3rd plugin:

## Các tính năng hay từ phiên bản này về trước

- Local variable in templates: @let
- input signal (instead of @Input())
- ModelInput signal
- takeUntilDestroyed
- Deferrable views
- https://hackernoon.com/a-guide-to-angular-signals-with-practical-use-cases-part-1
- Get form value change and show to html:
 `firstNameSignal = toSignal(this.form.get('firstName').valueChanges, {initialValue: ''});`
 `>{{ firstNameSignal() }}`
- Keep-Avive Http request
- Asynchronous Redirect Function
- Template expressions: {{ `hello, ${name}` }}
