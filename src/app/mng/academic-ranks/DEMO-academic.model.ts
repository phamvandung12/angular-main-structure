// File demo. Move the real file to src/app/core/models/.../
export interface IAcademicRanksDTO {
  academicRankName: string;
  academicRankNameEn: string;
  academicRankAbbreviation: string;
  academicRankAbbreviationEn: string;
}

export interface IAcademicRanks extends IAcademicRanksDTO {
  id: string;
  status: boolean;
}
