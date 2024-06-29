import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent implements OnInit {
  inputdata: any;
  closemessage = 'closed using directive';
  mediaUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  feedForm: FormGroup;
  username: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<UploadModalComponent>,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.feedForm = this.formBuilder.group({
      uploaderUserName: ['', Validators.required],
      likes: [0],
      comments: [0],
      url: ['']
    });
  }

  ngOnInit(): void {
    this.inputdata = this.data;
    this.username = this.cookieService.get('username');
    if (this.username) {
      this.feedForm.patchValue({
        uploaderUserName: this.username
      });
    }
  }

  closepopup(): void {
    this.ref.close('Closed using function');
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0] as File;
      this.displayMedia(this.selectedFile);
    }
  }

  private displayMedia(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.mediaUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  postWithCaption(): void {
    if (this.selectedFile && this.username) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('uploaderUserName', this.username);

      this.http.post('https://todeploywebapi.azurewebsites.net/api/Feeds/create', formData)
        .subscribe(
          (res) => {
            console.log(res);
            // Handle the response if necessary
          },
          (error: HttpErrorResponse) => {
            console.error('An error occurred:', error);
            // Handle the error or display it to the user
          }
        );
    } else {
      console.log('No file selected or username missing');
    }

    this.ref.close('Closed using function');
  }

  openFileInput(): void {
    const fileInput = document.getElementById('mediaInput');
    if (fileInput) {
      fileInput.click();
    }
  }
}
