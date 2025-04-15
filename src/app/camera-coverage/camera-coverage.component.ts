import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, AbstractControl } from '@angular/forms';

type Range = [number, number];

interface Camera {
  distance: Range;
  light: Range;
}

@Component({
  selector: 'app-camera-coverage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './camera-coverage.component.html',
  styleUrls: ['./camera-coverage.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraCoverageComponent implements OnInit {
  public form!: FormGroup;
  result: boolean | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      softwareDistance: this.createRangeGroup(0, 10),
      softwareLight: this.createRangeGroup(0, 10),
      hardwareCameras: this.fb.array([this.createCameraGroup()])
    });
  }

  private createRangeGroup(min: number, max: number): FormGroup {
    return this.fb.group({
      min: [min],
      max: [max]
    });
  }

  private createCameraGroup(): FormGroup {
    return this.fb.group({
      distance: this.createRangeGroup(0, 5),
      light: this.createRangeGroup(0, 5)
    });
  }

  get cameras(): FormArray {
    return this.form.get('hardwareCameras') as FormArray;
  }

  getControl(controlName: string): AbstractControl | null {
    return this.form.get(controlName);
  }

  addCamera(): void {
    this.cameras.push(this.createCameraGroup());
  }

  removeCamera(index: number): void {
    this.cameras.removeAt(index);
  }

  checkCoverage(): void {
    const formValue = this.form.value;
    const softwareDistance: Range = [formValue.softwareDistance.min, formValue.softwareDistance.max];
    const softwareLight: Range = [formValue.softwareLight.min, formValue.softwareLight.max];

    const hardwareCameras = this.getHardwareCameraRanges(formValue.hardwareCameras);

    this.result = this.isCovered(softwareDistance, softwareLight, hardwareCameras);
  }

  private getHardwareCameraRanges(hardwareCameras: any[]): Camera[] {
    return hardwareCameras.map(cam => ({
      distance: [cam.distance.min, cam.distance.max],
      light: [cam.light.min, cam.light.max]
    }));
  }

  private isCovered(softwareDistance: Range, softwareLight: Range, hardwareCameras: Camera[]): boolean {
    const step = 1;

    for (let d = softwareDistance[0]; d <= softwareDistance[1]; d += step) {
      for (let l = softwareLight[0]; l <= softwareLight[1]; l += step) {
        const isPointCovered = hardwareCameras.some(cam =>
          this.isPointCoveredByCamera(d, l, cam)
        );
        if (!isPointCovered) return false;
      }
    }
    return true;
  }

  private isPointCoveredByCamera(distance: number, light: number, camera: Camera): boolean {
    return (
      distance >= camera.distance[0] && distance <= camera.distance[1] &&
      light >= camera.light[0] && light <= camera.light[1]
    );
  }

  trackByIndex(index: number): number {
    return index;
  }
}
