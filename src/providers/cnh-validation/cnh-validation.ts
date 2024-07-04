import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class CnhValidationProvider {

    constructor(public http: HttpClient) {
    }

    getCnhData(photo: any) {
        const mostQiUrl = 'https://homolog.mostqi.most.com.br/v3.0/api/process-image/doc-extraction';

        let body = new HttpParams()
            .set("return_deskew_img", 'false')
            .set("document_type", 'cnh')
            .set("image", '');

        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type':  'application/json',
                'Authorization': 'Token 33d388888b7b455ea710a91f9187c1ca'
            })
        };

        return this.http.post(mostQiUrl, body, httpOptions);
    }
}
