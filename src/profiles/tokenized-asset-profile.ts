import {
    createMap,
    forMember,
    mapFrom,
    Mapper,
    mapWith,
} from "@automapper/core";
import { AutomapperProfile, InjectMapper } from "@automapper/nestjs";
import { Injectable } from "@nestjs/common";
import { TokenizedAssetResponseDto } from "src/tokenized-asset/dto/tokenized-asset-response.dto";
import { CollateralStatus } from "src/tokenized-asset/entities/collateral.entity";
import { Offer, OfferStatus } from "src/tokenized-asset/entities/offer.entity";
import { Ownership } from "src/tokenized-asset/entities/ownership.entity";
import { TokenizationProposal } from "src/tokenized-asset/entities/tokenization-proposal.entity";
import { TokenizedAsset } from "src/tokenized-asset/entities/tokenized-asset.entity";
import { OfferResponseDto } from "src/tokenized-asset/offer/dto/offer-response.dto";
import { OwnershipResponseDto } from "src/tokenized-asset/ownership/dto/ownership-response.dto";
import { TokenizationProposalResponseDto } from "src/tokenized-asset/proposal/dto/tokenization-proposal-response.dto";
import { UserResponseDto } from "src/users/dto/user-response.dto";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class TokenizedAssetProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper: Mapper) => {
            createMap(
                mapper,
                TokenizedAsset,
                TokenizedAssetResponseDto,
                forMember(
                    (dst) => dst.tokenizationProposal,
                    mapWith(
                        TokenizationProposalResponseDto,
                        TokenizationProposal,
                        (src) => src.tokenizationProposal,
                    ),
                ),
                forMember(
                    (dst) => dst.ownerships,
                    mapWith(
                        OwnershipResponseDto,
                        Ownership,
                        (src) => src.ownerships,
                    ),
                ),
            );

            createMap(
                mapper,
                TokenizationProposal,
                TokenizationProposalResponseDto,
                forMember(
                    (dst) => dst.user,
                    mapWith(UserResponseDto, User, (src) => src.user),
                ),
            );

            createMap(
                mapper,
                Ownership,
                OwnershipResponseDto,
                forMember(
                    (dst) => dst.user,
                    mapWith(UserResponseDto, User, (src) => src.user),
                ),
                forMember(
                    (dst) => dst.tokenizedAsset,
                    mapWith(
                        TokenizedAssetResponseDto,
                        TokenizedAsset,
                        (src) => src.tokenizedAsset,
                    ),
                ),
                forMember(
                    (dst) => dst.availablePercentage,
                    mapFrom((src) => {
                        return (
                            Math.round(
                                (src.percentageOwned -
                                    src.offers
                                        ?.filter(
                                            (of) =>
                                                of.status.toString() ===
                                                OfferStatus.AVAILABLE.toString(),
                                        )
                                        ?.map((of) => of.percentage)
                                        .reduce(
                                            (c, total) =>
                                                Number(total) + Number(c),
                                            0,
                                        ) -
                                    src.collaterals
                                        ?.filter(
                                            (c) =>
                                                c.status.toString() ===
                                                    CollateralStatus.ACTIVE.toString() ||
                                                c.status.toString() ===
                                                    CollateralStatus.PENDING_CONFIRMATION.toString(),
                                        )
                                        ?.map((c) => c.percentage)
                                        .reduce(
                                            (p, total) =>
                                                Number(total) + Number(p),
                                            0,
                                        )) *
                                    1000,
                            ) / 1000
                        );
                    }),
                ),
            );

            createMap(
                mapper,
                Offer,
                OfferResponseDto,
                forMember(
                    (dst) => dst.ownership,
                    mapWith(
                        OwnershipResponseDto,
                        Ownership,
                        (src) => src.ownership,
                    ),
                ),
                forMember(
                    (dst) => dst.currentBuyer,
                    mapWith(UserResponseDto, User, (src) => src.currentBuyer),
                ),
            );
        };
    }
}
