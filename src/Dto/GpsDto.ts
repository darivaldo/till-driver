export class GpsDto {
    public lat: String;
    public lng: String;
    public dataGPS: String;
    public GMT: String;

    constructor() {
        this.lat = "";
        this.lng = "";
        this.dataGPS = new Date().toDateString();
        this.GMT = "";
    }
}
