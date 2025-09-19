import { Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'portfolio';

   @ViewChild('dot', { static: true }) dotRef!: ElementRef<HTMLDivElement>;
  @ViewChild('ring', { static: true }) ringRef!: ElementRef<HTMLDivElement>;

  private mouseX = 0;
  private mouseY = 0;
  private ringX = 0;
  private ringY = 0;
  private rafId: number | null = null;

  // store elements & handlers to clean up
  private interactiveEls: HTMLElement[] = [];
  private enterHandler = () => document.body.classList.add('cursor-hover');
  private leaveHandler = () => document.body.classList.remove('cursor-hover');

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // start animation loop
    this.rafId = requestAnimationFrame(this.renderLoop.bind(this));

    // add hover listeners to interactive elements
    const selector = 'a, button, input, textarea, [data-cursor-hover], .hover-target';
    this.interactiveEls = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
    this.interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', this.enterHandler);
      el.addEventListener('mouseleave', this.leaveHandler);
    });

    // hide cursor when leaving window
    document.addEventListener('mouseleave', this.onMouseLeave);
    document.addEventListener('mouseenter', this.onMouseEnter);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    // make visible if hidden
    this.renderer.removeClass(this.dotRef.nativeElement, 'hidden');
    this.renderer.removeClass(this.ringRef.nativeElement, 'hidden');
  }

  @HostListener('document:mousedown')
  onMouseDown() {
    // add temporary click class to body
    this.renderer.addClass(document.body, 'cursor-click');
    window.setTimeout(() => this.renderer.removeClass(document.body, 'cursor-click'), 220);
  }

  private onMouseLeave = () => {
    this.renderer.addClass(this.dotRef.nativeElement, 'hidden');
    this.renderer.addClass(this.ringRef.nativeElement, 'hidden');
  };

  private onMouseEnter = () => {
    this.renderer.removeClass(this.dotRef.nativeElement, 'hidden');
    this.renderer.removeClass(this.ringRef.nativeElement, 'hidden');
  };

  private renderLoop() {
    // Dot: instant follow (snappy)
    this.dotRef.nativeElement.style.setProperty('--x', `${this.mouseX}px`);
    this.dotRef.nativeElement.style.setProperty('--y', `${this.mouseY}px`);

    // Ring: smooth lerp follow
    this.ringX += (this.mouseX - this.ringX) * 0.12;
    this.ringY += (this.mouseY - this.ringY) * 0.12;
    this.ringRef.nativeElement.style.setProperty('--x', `${this.ringX}px`);
    this.ringRef.nativeElement.style.setProperty('--y', `${this.ringY}px`);

    this.rafId = requestAnimationFrame(this.renderLoop.bind(this));
  }

  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);

    this.interactiveEls.forEach(el => {
      el.removeEventListener('mouseenter', this.enterHandler);
      el.removeEventListener('mouseleave', this.leaveHandler);
    });

    document.removeEventListener('mouseleave', this.onMouseLeave);
    document.removeEventListener('mouseenter', this.onMouseEnter);
  }
}
