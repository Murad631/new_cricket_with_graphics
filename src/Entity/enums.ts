export enum TeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum PlayerRole {
  BAT = 'BAT',
  BOWL = 'BOWL',
  ALL_ROUNDER = 'ALL_ROUNDER',
  WK = 'WK',
}

export enum MatchFormat {
  T10 = 'T10',
  T20 = 'T20',
  ODI = 'ODI',
  TEST = 'TEST',
  CUSTOM = 'CUSTOM',
}

export enum MatchStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINISHED = 'FINISHED',
  CANCEL = 'CANCEL'
}

export enum TossDecision {
  BAT = 'BAT',
  BOWL = 'BOWL',
}

export enum InningsNumber {
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD',
  FOURTH = 'FOURTH',
}

export enum DeliveryKind {
  RUN = 'RUN',
  WIDE = 'WIDE',
  NOBALL = 'NOBALL',
  BYE = 'BYE',
  LEG_BYE = 'LEG_BYE',
  PENALTY = 'PENALTY',
  WICKET = 'Wicket',
}

export enum WicketType {
  BOWLED = 'BOWLED',
  CAUGHT = 'CAUGHT',
  LBW = 'LBW',
  RUN_OUT = 'RUN_OUT',
  STUMPED = 'STUMPED',
  HIT_WICKET = 'HIT_WICKET',
  RETIRED_HURT = 'RETIRED_HURT',
  TIMED_OUT = 'TIMED_OUT',
}

export enum OutEnd {
  STRIKER = 'STRIKER',
  NON_STRIKER = 'NON_STRIKER',
  UNKNOWN = 'UNKNOWN',
}
