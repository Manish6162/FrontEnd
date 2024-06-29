import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UploadModalComponent } from './upload-modal/upload-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent {
  
  // @ViewChild('fileInput') fileInput!: ElementRef;
  // @ViewChild(UploadModalComponent) modal!: UploadModalComponent;

  uploadComplete = false;
  percentDone = 0;
  showCaptionModal = false;
  caption: string = '';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  onTextBoxHover() {
    this.changeColor('.start-post', '#f2f2f2');
  }

  onTextBoxHoverOut() {
    this.changeColor('.start-post', '#ffffff');
  }

  onMediaBoxHover() {
  //  this.changeColor('.media-box', '#f2f2f2');

     this.changeColor('.media-icon', '#007bff');


  }

  onMediaBoxHoverOut() {
    this.changeColor('.media-box', '#007bff');
  }


  private changeColor(className: string, color: string) {
    const element = document.querySelector(className) as HTMLElement;
    if (element) {
      element.style.backgroundColor = color;
    }
  }
  
  

  Openpopup(): void {
    // Method implementation without any arguments
    const dialogRef = this.dialog.open(UploadModalComponent, {
      width: '50%',
      height: '70%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {
        // Pass any default data if needed
      }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The modal was closed', result);
      // Handle any result from the modal if needed
    });
  }
  
}
