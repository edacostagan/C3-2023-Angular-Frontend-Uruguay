import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class MessengerService {


  constructor(
    private messenger: MatSnackBar,

  ) { }

  /**
   * Presenta un mensaje en pantalla
   * @param mensaje mensaje a mostrar
   * @param accion texto para la accion (opcional)
   * @param duration tiempo que dura el mensaje en ms (1000 = 1 segundo)
   */
  public infoMsg(mensaje: string, accion: string, duration: number | undefined ){
    this.messenger.open(mensaje, accion, {
      duration,
      horizontalPosition: "center",
      verticalPosition: "bottom",
    });
  }

}
