package com.trampopoints.dto;

import java.util.List;

public class MatchResponseDto {
    private String requestId;
    private List<TripMatchDto> matches;

    public MatchResponseDto() {}

    public MatchResponseDto(String requestId, List<TripMatchDto> matches) {
        this.requestId = requestId;
        this.matches = matches;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public List<TripMatchDto> getMatches() {
        return matches;
    }

    public void setMatches(List<TripMatchDto> matches) {
        this.matches = matches;
    }
}
