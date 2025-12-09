import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @ViewChild('callback_popup')callbackPopup!: TemplateRef<ElementRef>;
  @ViewChild('callback_confirmation')callbackConf!: TemplateRef<ElementRef>;

  private dialogRefCallback: MatDialogRef<any> | null = null;
  private dialogRefCallbackConf: MatDialogRef<any> | null = null;

  callbackForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
  });

  constructor(private dialog: MatDialog,
              private fb: FormBuilder,) { }

  ngOnInit(): void {
  }

  protected openCallback(){
    this.dialogRefCallback = this.dialog.open(this.callbackPopup);
    this.dialogRefCallback!.backdropClick()
      .subscribe(() => {
      });
  }
  protected orderCallback(){
    this.dialogRefCallback?.close();
    this.dialogRefCallbackConf = this.dialog.open(this.callbackConf);
    this.dialogRefCallbackConf!.backdropClick()
      .subscribe(() => {
      });
  }
  protected closeDialog() {
    this.dialogRefCallback?.close();
    this.dialogRefCallbackConf?.close();
  }
}
