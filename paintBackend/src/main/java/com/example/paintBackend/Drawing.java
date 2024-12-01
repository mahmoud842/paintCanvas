package com.example.paintBackend;

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;

import java.util.List;

public class Drawing {
    private String name;

    @JacksonXmlElementWrapper(localName = "shapes")
    @JacksonXmlProperty(localName = "shape")
    private List<Object> shapes;

    // Default constructor
    public Drawing() {
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<Object> getShapes() {
        return shapes;
    }

    public void setShapes(List<Object> shapes) {
        this.shapes = shapes;
    }
}
