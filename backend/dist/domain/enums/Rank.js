"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RankWeight = exports.RankLabels = exports.Rank = void 0;
var Rank;
(function (Rank) {
    Rank["PROFESSOR"] = "PROFESSOR";
    Rank["READER"] = "READER";
    Rank["SENIOR_LECTURER"] = "SENIOR_LECTURER";
    Rank["LECTURER_I"] = "LECTURER_I";
    Rank["LECTURER_II"] = "LECTURER_II";
    Rank["ASSISTANT_LECTURER"] = "ASSISTANT_LECTURER";
    Rank["GRADUATE_ASSISTANT"] = "GRADUATE_ASSISTANT";
    Rank["ADJUNCT_LECTURER"] = "ADJUNCT_LECTURER";
    Rank["VISITING_LECTURER"] = "VISITING_LECTURER";
})(Rank || (exports.Rank = Rank = {}));
exports.RankLabels = {
    [Rank.PROFESSOR]: 'Professor',
    [Rank.READER]: 'Reader',
    [Rank.SENIOR_LECTURER]: 'Senior Lecturer',
    [Rank.LECTURER_I]: 'Lecturer I',
    [Rank.LECTURER_II]: 'Lecturer II',
    [Rank.ASSISTANT_LECTURER]: 'Assistant Lecturer',
    [Rank.GRADUATE_ASSISTANT]: 'Graduate Assistant',
    [Rank.ADJUNCT_LECTURER]: 'Adjunct Lecturer',
    [Rank.VISITING_LECTURER]: 'Visiting Lecturer'
};
exports.RankWeight = {
    [Rank.PROFESSOR]: 10,
    [Rank.READER]: 9,
    [Rank.SENIOR_LECTURER]: 8,
    [Rank.LECTURER_I]: 7,
    [Rank.LECTURER_II]: 6,
    [Rank.ASSISTANT_LECTURER]: 5,
    [Rank.GRADUATE_ASSISTANT]: 4,
    [Rank.ADJUNCT_LECTURER]: 3,
    [Rank.VISITING_LECTURER]: 2
};
//# sourceMappingURL=Rank.js.map