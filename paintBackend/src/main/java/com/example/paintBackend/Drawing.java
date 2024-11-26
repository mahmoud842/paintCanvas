package com.example.paintBackend;

import java.util.List;

public class Drawing {
    private String name;
    private List<Object> shapes; // A list of shapes as generic objects

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
