import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadModalComponent } from '../post/upload-modal/upload-modal.component';  // Correct path to the component

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() username!: string;
  @Input() profilePicUrl!: string;

  constructor(private dialog: MatDialog) {}

  Openpopup(): void {
    const dialogRef = this.dialog.open(UploadModalComponent, {
      width: '50%',
      height: '70%',
      enterAnimationDuration: '1000ms',
      exitAnimationDuration: '1000ms',
      data: {}
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The modal was closed', result);
    });
  }
}
