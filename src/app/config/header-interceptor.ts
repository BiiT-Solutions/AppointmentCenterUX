import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import { SessionService } from "appointment-center-structure-lib";
import {Constants} from "../shared/constants";

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(private sessionService: SessionService) {  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const request: HttpRequest<any> = req.clone({
      headers: req.headers.append(Constants.HEADERS.AUTHORIZATION, `Bearer ${this.sessionService.getToken()}`)
    });
    return next.handle(request);
  }
}
