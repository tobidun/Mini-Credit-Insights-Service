import { ApiProperty } from "@nestjs/swagger";

export class TransactionDto {
  @ApiProperty({ description: "Transaction date" })
  transactionDate: string;

  @ApiProperty({ description: "Transaction description" })
  description: string;

  @ApiProperty({ description: "Transaction amount" })
  amount: number;

  @ApiProperty({
    description: "Account balance after transaction",
    required: false,
  })
  balance?: number;
}

export class StatementUploadResponseDto {
  @ApiProperty({ description: "Statement ID" })
  id: number;

  @ApiProperty({ description: "Upload status" })
  status: string;

  @ApiProperty({ description: "Total transactions processed" })
  totalTransactions: number;

  @ApiProperty({ description: "Parsing success rate" })
  parsingSuccessRate: number;
}

export class StatementDto {
  @ApiProperty({ description: "Statement ID" })
  id: number;

  @ApiProperty({ description: "Filename" })
  filename: string;

  @ApiProperty({ description: "Upload date" })
  uploadDate: Date;

  @ApiProperty({ description: "Processing status" })
  status: string;

  @ApiProperty({ description: "Total transactions" })
  totalTransactions: number;

  @ApiProperty({ description: "Parsing success rate" })
  parsingSuccessRate: number;
}
