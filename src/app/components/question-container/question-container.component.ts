import { Component, ViewEncapsulation } from '@angular/core';
import { SideBarQuestionComponent } from '../side-bar-question/side-bar-question.component';
import { QuestionCardComponent } from '../question-card/question-card.component';
import { Chapter } from './model/chapter.model';

@Component({
  selector: 'app-question-container',
  standalone: true,
  imports: [SideBarQuestionComponent, QuestionCardComponent],
  templateUrl: './question-container.component.html',
  styleUrl: './question-container.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class QuestionContainerComponent {
  listChapter: Chapter[] = [
    {
      id: 0,
      name: '--All--',
      description: 'Tất cả các câu hỏi',
      iconName: 'functions',
      className: 'all-chapter',
    },
    {
      id: 1,
      name: 'Chapter 1',
      description: 'Quy định chung và quy tắc giao thông đường bộ',
      iconName: 'gavel',
      className: 'chapter-1',
    },
    {
      id: 2,
      name: 'Chapter 2',
      description: 'Văn hóa giao thông và đạo đức người lái xe',
      iconName: 'volunteer_activism',
      className: 'chapter-2',
    },
    {
      id: 3,
      name: 'Chapter 3',
      description: 'Kỹ thuật lái xe',
      iconName: 'settings_input_component',
      className: 'chapter-3',
    },
    {
      id: 4,
      name: 'Chapter 4',
      description: 'Cấu tạo và sửa chữa',
      iconName: 'build',
      className: 'chapter-4',
    },
    {
      id: 5,
      name: 'Chapter 5',
      description: 'Báo hiệu đường bộ',
      iconName: 'traffic',
      className: 'chapter-5',
    },
    {
      id: 6,
      name: 'Chapter 6',
      description: 'Giải sa hình và xử lý tình huống giao thông',
      iconName: 'alt_route',
      className: 'chapter-6',
    },
     {
      id: 7,
      name: 'Câu hỏi quan trọng',
      description: 'Các câu hỏi quan trọng cần chú ý (điểm liệt)',
      iconName: 'emergency',
      className: 'chapter-7',
    },
  ];
}
