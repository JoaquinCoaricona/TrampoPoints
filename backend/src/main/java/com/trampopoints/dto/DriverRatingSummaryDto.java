package com.trampopoints.dto;

import java.util.ArrayList;
import java.util.List;

public class DriverRatingSummaryDto {
    private Double ratingAverage;
    private Integer totalRatings;
    private Integer fiveStars;
    private Integer fourStars;
    private Integer threeStars;
    private Integer twoStars;
    private Integer oneStar;
    private List<DriverRatingDto> recentRatings = new ArrayList<>();

    public DriverRatingSummaryDto() {}

    public DriverRatingSummaryDto(Double ratingAverage, Integer totalRatings, Integer fiveStars, Integer fourStars, Integer threeStars, Integer twoStars, Integer oneStar, List<DriverRatingDto> recentRatings) {
        this.ratingAverage = ratingAverage;
        this.totalRatings = totalRatings;
        this.fiveStars = fiveStars;
        this.fourStars = fourStars;
        this.threeStars = threeStars;
        this.twoStars = twoStars;
        this.oneStar = oneStar;
        this.recentRatings = recentRatings != null ? recentRatings : new ArrayList<>();
    }

    public Double getRatingAverage() {
        return ratingAverage;
    }

    public void setRatingAverage(Double ratingAverage) {
        this.ratingAverage = ratingAverage;
    }

    public Integer getTotalRatings() {
        return totalRatings;
    }

    public void setTotalRatings(Integer totalRatings) {
        this.totalRatings = totalRatings;
    }

    public Integer getFiveStars() {
        return fiveStars;
    }

    public void setFiveStars(Integer fiveStars) {
        this.fiveStars = fiveStars;
    }

    public Integer getFourStars() {
        return fourStars;
    }

    public void setFourStars(Integer fourStars) {
        this.fourStars = fourStars;
    }

    public Integer getThreeStars() {
        return threeStars;
    }

    public void setThreeStars(Integer threeStars) {
        this.threeStars = threeStars;
    }

    public Integer getTwoStars() {
        return twoStars;
    }

    public void setTwoStars(Integer twoStars) {
        this.twoStars = twoStars;
    }

    public Integer getOneStar() {
        return oneStar;
    }

    public void setOneStar(Integer oneStar) {
        this.oneStar = oneStar;
    }

    public List<DriverRatingDto> getRecentRatings() {
        return recentRatings;
    }

    public void setRecentRatings(List<DriverRatingDto> recentRatings) {
        this.recentRatings = recentRatings;
    }
}
