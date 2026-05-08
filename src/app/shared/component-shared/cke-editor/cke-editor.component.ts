import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, OnInit, output, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  AccessibilityHelp,
  Alignment,
  Autoformat,
  AutoImage,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  ClassicEditor,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Paragraph,
  PasteFromOffice,
  RemoveFormat,
  SelectAll,
  SimpleUploadAdapter,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  Undo,
  type EditorConfig,
} from 'ckeditor5';
import { timer } from 'rxjs';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cke-editor',
  imports: [FormsModule, CKEditorModule],
  template: `@if (ckeReady) { <ckeditor [editor]="editor" [config]="config" [ngModel]="internalCkeData" (ngModelChange)="onChange($event)" /> }
  @else { <div class="w-full text-center italic">Loading editor...</div> }`,
  styleUrls: [
    '../../../../../node_modules/ckeditor5/dist/browser/ckeditor5.css',
    './cke-editor.component.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CkeEditorComponent implements OnInit, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  readonly ckeData = input('');
  readonly refFormGroup = input<FormGroup | null>(null);
  readonly refFormControlName = input('');
  readonly ckeDataChange = output<string>();

  internalCkeData = '';
  ckeReady = false;
  editor = ClassicEditor;
  config: EditorConfig = {
    // Why licenseKey: https://github.com/ckeditor/ckeditor5/blob/master/docs/getting-started/licensing/license-key-and-activation.md#using-the-gpl-key
    // Install version "^43.3.1" will not need this "licenseKey" field
    licenseKey: 'GPL',
    toolbar: {
      items: [
        'heading', '|', 'removeFormat', 'alignment', 'bold', 'italic', 'underline',
        'strikethrough', 'link', 'insertImage', 'mediaEmbed', 'highlight', '|',
        'outdent', 'indent', 'specialCharacters', '|', 'fontSize',
        'fontBackgroundColor', 'fontColor', 'fontFamily', 'bulletedList',
        'numberedList', 'insertTable', 'subscript', 'superscript', 'blockQuote',
        'undo', 'redo', 'findAndReplace', 'codeBlock', 'code', 'htmlEmbed',
        'horizontalLine', 'selectAll', '|', 'sourceEditing',
      ],
      shouldNotGroupWhenFull: false,
    },
    plugins: [
      AccessibilityHelp,
      Alignment,
      Autoformat,
      AutoImage,
      Autosave,
      BalloonToolbar,
      BlockQuote,
      Bold,
      Code,
      CodeBlock,
      Essentials,
      FindAndReplace,
      FontBackgroundColor,
      FontColor,
      FontFamily,
      FontSize,
      GeneralHtmlSupport,
      Heading,
      Highlight,
      HorizontalLine,
      HtmlEmbed,
      ImageBlock,
      ImageCaption,
      ImageInline,
      ImageInsert,
      ImageInsertViaUrl,
      ImageResize,
      ImageStyle,
      ImageTextAlternative,
      ImageToolbar,
      ImageUpload,
      Indent,
      IndentBlock,
      Italic,
      Link,
      LinkImage,
      List,
      ListProperties,
      MediaEmbed,
      Paragraph,
      PasteFromOffice,
      RemoveFormat,
      SelectAll,
      SimpleUploadAdapter,
      SourceEditing,
      SpecialCharacters,
      SpecialCharactersArrows,
      SpecialCharactersCurrency,
      SpecialCharactersEssentials,
      SpecialCharactersLatin,
      SpecialCharactersMathematical,
      SpecialCharactersText,
      Strikethrough,
      Style,
      Subscript,
      Superscript,
      Table,
      TableCaption,
      TableCellProperties,
      TableColumnResize,
      TableProperties,
      TableToolbar,
      TextTransformation,
      TodoList,
      Underline,
      Undo,
    ],
    balloonToolbar: ['bold', 'italic', 'underline', 'strikethrough', '|', 'link', 'highlight'],
    fontFamily: {
      supportAllValues: true,
    },
    fontSize: {
      options: [10, 12, 14, 'default', 18, 20, 22],
      supportAllValues: true,
    },
    heading: {
      options: [
        {
          model: 'paragraph',
          title: 'Paragraph',
          class: 'ck-heading_paragraph',
        },
        {
          model: 'heading1',
          view: 'h1',
          title: 'Heading 1',
          class: 'ck-heading_heading1',
        },
        {
          model: 'heading2',
          view: 'h2',
          title: 'Heading 2',
          class: 'ck-heading_heading2',
        },
        {
          model: 'heading3',
          view: 'h3',
          title: 'Heading 3',
          class: 'ck-heading_heading3',
        },
        {
          model: 'heading4',
          view: 'h4',
          title: 'Heading 4',
          class: 'ck-heading_heading4',
        },
        {
          model: 'heading5',
          view: 'h5',
          title: 'Heading 5',
          class: 'ck-heading_heading5',
        },
        {
          model: 'heading6',
          view: 'h6',
          title: 'Heading 6',
          class: 'ck-heading_heading6',
        },
      ],
    },
    htmlSupport: {
      allow: [
        {
          name: /^.*$/,
          styles: true,
          attributes: true,
          classes: true,
        },
      ],
    },
    image: {
      toolbar: [
        'toggleImageCaption',
        'imageTextAlternative',
        '|',
        'imageStyle:inline',
        'imageStyle:wrapText',
        'imageStyle:breakText',
        '|',
        'resizeImage',
      ],
    },
    initialData: '',
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: 'https://',
      decorators: {
        toggleDownloadable: {
          mode: 'manual',
          label: 'Downloadable',
          attributes: {
            download: 'file',
          },
        },
      },
    },
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    menuBar: {
      isVisible: true,
    },
    placeholder: '',
    style: {
      definitions: [
        {
          name: 'Article category',
          element: 'h3',
          classes: ['category'],
        },
        {
          name: 'Title',
          element: 'h2',
          classes: ['document-title'],
        },
        {
          name: 'Subtitle',
          element: 'h3',
          classes: ['document-subtitle'],
        },
        {
          name: 'Info box',
          element: 'p',
          classes: ['info-box'],
        },
        {
          name: 'Side quote',
          element: 'blockquote',
          classes: ['side-quote'],
        },
        {
          name: 'Marker',
          element: 'span',
          classes: ['marker'],
        },
        {
          name: 'Spoiler',
          element: 'span',
          classes: ['spoiler'],
        },
        {
          name: 'Code (dark)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-dark'],
        },
        {
          name: 'Code (bright)',
          element: 'pre',
          classes: ['fancy-code', 'fancy-code-bright'],
        },
      ],
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
    },
    simpleUpload: {
      // uploadUrl: UrlConstant.API.CKE_IMG,
      uploadUrl: 'http://aaa.aaa',
      withCredentials: true,
      headers: {
        // Authorization: `Bearer ${JSON.parse(localStorage.getItem(SystemConstant.CURRENT_INFO) ?? '{}')?.token}`
      },
    },
    mediaEmbed: {
      previewsInData: true,
      // Block mediaEmbed from domain;
      // Docs: https://ckeditor.com/docs/ckeditor5/latest/api/module_media-embed_mediaembed-MediaEmbedConfig.html
      // removeProviders: [],
    },
    extraPlugins: [],
    removePlugins: [],
  };

  ngOnInit(): void {
    this.internalCkeData = this.ckeData();
  }

  ngAfterViewInit(): void {
    const refFormControlName = this.refFormControlName();
    const refFormGroup = this.refFormGroup();
    if (refFormControlName && refFormGroup) {
      refFormGroup?.get(refFormControlName)?.valueChanges.subscribe((newValue: string) => {
        this.internalCkeData = newValue;
        this.cdr.detectChanges();
      });
      this.internalCkeData = refFormGroup?.get(refFormControlName)?.value;
    }
    timer(100).subscribe(() => {
      this.ckeReady = true;
      this.cdr.detectChanges();
    });
  }

  onChange(newValue: string) {
    const refFormControlName = this.refFormControlName();
    const refFormGroup = this.refFormGroup();
    if (refFormControlName && refFormGroup) {
      refFormGroup?.get(refFormControlName)?.setValue(newValue);
    }
    this.ckeDataChange.emit(newValue);
  }
}
