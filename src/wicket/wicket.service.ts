import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wicket } from '../Entity/wicket.entity';
import { WicketType } from '../Entity/enums';

@Injectable()
export class WicketService {
    constructor(
        @InjectRepository(Wicket)
        private readonly wicketRepository: Repository<Wicket>,
    ) { }

    async processWicket(inningsId: number, outBatsmanId: number, bowlerId: number | undefined, type: WicketType): Promise<Wicket> {
        const wicket = this.wicketRepository.create({
            inningsId,
            outBatsmanSquadId: outBatsmanId,
            creditedBowlerSquadId: bowlerId,
            type,
        });
        return this.wicketRepository.save(wicket);
    }
}
