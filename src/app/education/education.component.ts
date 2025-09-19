import { Component } from '@angular/core';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css']
})
export class EducationComponent {
  private revealOnScroll = () => {
    const items = document.querySelectorAll(".reveal");
    const triggerBottom = window.innerHeight - 100;

    items.forEach((item) => {
      const itemTop = (item as HTMLElement).getBoundingClientRect().top;
      if (itemTop < triggerBottom) {
        item.classList.add("revealed");
      }
    });
  }

  ngAfterViewInit(): void {
    window.addEventListener("scroll", this.revealOnScroll);
    this.revealOnScroll(); 
  }

  ngOnDestroy(): void {
    window.removeEventListener("scroll", this.revealOnScroll); 
  }
}

