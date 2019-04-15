'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var ElectionType;
(function(ElectionType) {
  ElectionType['InstantRunoff'] = 'INSTANT_RUNOFF';
  ElectionType['MultiSeat'] = 'MULTI_SEAT';
  ElectionType['DemocraticPrimary'] = 'DEMOCRATIC_PRIMARY';
})((ElectionType = exports.ElectionType || (exports.ElectionType = {})));
var CandidateAction;
(function(CandidateAction) {
  CandidateAction['elected'] = 'ELECTED - MET QUOTA';
  CandidateAction['assigned'] = 'ELECTED - OTHER CANDIDATES ELIMINATED';
  CandidateAction['eliminated'] = 'ELIMINATED - FEWEST VOTES';
})(
  (CandidateAction = exports.CandidateAction || (exports.CandidateAction = {}))
);
var ElectionStatus;
(function(ElectionStatus) {
  ElectionStatus['DRAFT'] = 'DRAFT';
  ElectionStatus['QUEUED'] = 'QUEUED';
  ElectionStatus['IN_PROGRESS'] = 'IN_PROGRESS';
  ElectionStatus['POLLS_CLOSED'] = 'POLLS_CLOSED';
})((ElectionStatus = exports.ElectionStatus || (exports.ElectionStatus = {})));
var ElectionResultsVisibility;
(function(ElectionResultsVisibility) {
  ElectionResultsVisibility['LIVE'] = 'LIVE';
  ElectionResultsVisibility['LIVE_FOR_VOTERS'] = 'LIVE_FOR_VOTERS';
  ElectionResultsVisibility['AFTER_CLOSE'] = 'AFTER_CLOSE';
})(
  (ElectionResultsVisibility =
    exports.ElectionResultsVisibility ||
    (exports.ElectionResultsVisibility = {}))
);
//# sourceMappingURL=index.js.map
