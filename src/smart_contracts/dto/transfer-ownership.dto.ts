export class TransferOwnershipDto {
    transferShares: number;
    seller: string;
    buyer: string;
    isEffectiveOwnerTransfer: boolean;
    contractAddress: string;
}
