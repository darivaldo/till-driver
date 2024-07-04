import { OriginDto } from "./OriginDto";
import { DestinationDto } from "./DestinationDto";

export class TripsDto {
    public $key: string;
    public $value: string;

    public origin: OriginDto
    public pickedUpAt: Date;

    public destination: DestinationDto
    public droppedOffAt: Date;

    public paymentMethod: string;
    public fee: number;
    public promo: number;
    public discount: number;
    public currency: number;
    public distance: number;

    public driverId: String;
    public otp: number;
    public status: String;

    public notifiedAt: Date;

    public createdAt: Date;
    public updatedAt: Date;

}


