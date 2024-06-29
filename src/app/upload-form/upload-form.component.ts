import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserService } from 'path-to-your-user-service';

@Component({
  selector: 'app-upload-modal',
  templateUrl: './upload-modal.component.html',
  styleUrls: ['./upload-modal.component.scss']
})
export class UploadModalComponent implements OnInit {
  inputdata: any;
  editdata: any;
  closemessage = 'closed using directive';
  mediaUrl: string | ArrayBuffer | null = null; // To store the URL of the selected media
  caption: string = '';
  selectedFile: File | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<UploadModalComponent>,
    private buildr: FormBuilder,
    private http: HttpClient,
    private userService: UserService // Inject UserService
  ) {}

  ngOnInit(): void {
    this.inputdata = this.data;
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
    if (this.selectedFile) {
      const formData: FormData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);
      formData.append('caption', this.caption);

      // Get the username from the UserService
      const username = this.userService.getUsername();
      if (username) {
        formData.append('username', username);
      } else {
        // Handle the case where the username is not available
        console.error('Username not available.');
      }

      this.http.post('https://todeploywebapi.azurewebsites.net/api//Feeds/create', formData)
        .subscribe(
          (res) => {
            console.log(res);
            // Handle the response if necessary
          },
          (error: HttpErrorResponse) => {
            console.log('An error occurred:', error);
            // Handle the error or display it to the user
          }
        );
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
