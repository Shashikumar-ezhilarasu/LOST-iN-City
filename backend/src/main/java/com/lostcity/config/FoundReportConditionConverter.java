package com.lostcity.config;

import com.lostcity.model.FoundReport;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.stereotype.Component;

@Component
@ReadingConverter
public class FoundReportConditionConverter implements Converter<String, FoundReport.Condition> {

    @Override
    public FoundReport.Condition convert(String source) {
        if (source == null || source.trim().isEmpty()) {
            return null;
        }

        try {
            // Try to match common variants
            String upperCondition = source.trim().toUpperCase();
            switch (upperCondition) {
                case "EXCELLENT":
                case "LIKE NEW":
                case "MINT":
                case "LIKE_NEW":
                    return FoundReport.Condition.NEW;
                case "GOOD":
                case "FINE":
                case "OK":
                case "OKAY":
                    return FoundReport.Condition.GOOD;
                case "WORN":
                case "USED":
                case "FAIR":
                    return FoundReport.Condition.WORN;
                case "DAMAGED":
                case "POOR":
                case "BROKEN":
                case "BAD":
                    return FoundReport.Condition.DAMAGED;
                default:
                    // Try direct enum match
                    return FoundReport.Condition.valueOf(upperCondition);
            }
        } catch (IllegalArgumentException e) {
            // If parsing fails, default to GOOD to prevent errors
            return FoundReport.Condition.GOOD;
        }
    }
}
