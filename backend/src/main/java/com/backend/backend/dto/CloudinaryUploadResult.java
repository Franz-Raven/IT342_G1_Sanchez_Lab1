package com.backend.backend.dto;

public class CloudinaryUploadResult {
    private String url;
    private String format;

    public CloudinaryUploadResult(String url, String format) {
        this.url = url;
        this.format = format;
    }

    public String getUrl() { return url; }
    public String getFormat() { return format; }
}