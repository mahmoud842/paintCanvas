package com.example.paintBackend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Base64;

@RestController
@RequestMapping("/drawings")
public class PaintBackendController {

    private final Path dataDirectory = Paths.get("data");
    private final Path imagesDirectory = Paths.get("images");

    public PaintBackendController() {
        try {
            Files.createDirectories(dataDirectory);
            Files.createDirectories(imagesDirectory);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    // Save a drawing and return its unique ID
    @PostMapping
    public ResponseEntity<Map<String, Object>> saveDrawing(@RequestBody Drawing drawing) {
        String uniqueId = UUID.randomUUID().toString();
        if (saveToFile(uniqueId, drawing)) {
            return ResponseEntity.ok(Map.of("success", true, "id", uniqueId));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false));
        }
    }

    // Save an image associated with a specific ID
    @PostMapping("/{id}/image")
    public ResponseEntity<Map<String, Boolean>> saveImage(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file
    ) {
        if (saveImageToFile(id, file)) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false));
        }
    }

    // Retrieve a specific drawing by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getDrawingById(@PathVariable String id) {
        try {
            Path filePath = dataDirectory.resolve(id + ".json");

            if (!Files.exists(filePath)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Drawing not found"));
            }

            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, Object> drawing = objectMapper.readValue(Files.newBufferedReader(filePath), Map.class);
            return ResponseEntity.ok(drawing);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Retrieve all images with their IDs and Base64 content
    @GetMapping("/images")
    public ResponseEntity<List<Map<String, String>>> getAllImagesWithIdsAndContent() {
        try {
            List<Map<String, String>> images = Files.list(imagesDirectory)
                    .filter(Files::isRegularFile)
                    .map(path -> {
                        String fileName = path.getFileName().toString();
                        String id = fileName.substring(0, fileName.lastIndexOf("."));
                        try {
                            byte[] imageBytes = Files.readAllBytes(path);
                            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
                            return Map.of("id", id, "image", base64Image);
                        } catch (IOException e) {
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(Objects::nonNull) // Filter out any failed reads
                    .collect(Collectors.toList());

            return ResponseEntity.ok(images);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // Helper method to save a drawing as JSON
    private boolean saveToFile(String id, Drawing drawing) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String jsonString = objectMapper.writeValueAsString(drawing);
            Path filePath = dataDirectory.resolve(id + ".json");
            Files.write(filePath, jsonString.getBytes());
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    // Helper method to save an image file
    private boolean saveImageToFile(String id, MultipartFile file) {
        try {
            Path filePath = imagesDirectory.resolve(id + ".png");
            Files.write(filePath, file.getBytes());
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}
