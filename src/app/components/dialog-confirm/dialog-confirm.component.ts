import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIcon,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
  ],
  templateUrl: './dialog-confirm.component.html',
  styleUrl: './dialog-confirm.component.scss',
})
export class DialogConfirmComponent {
  readonly dialogRef = inject(MatDialogRef<DialogConfirmComponent>);

  data = inject<{ title: string; content: string }>(MAT_DIALOG_DATA);

  onCloseClick() {
    this.dialogRef.close();
  }
}
