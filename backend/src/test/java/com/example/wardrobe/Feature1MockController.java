package com.example.wardrobe;

public class Feature1MockController {
    
}
package com.example.demo.feature1;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class Feature1MockController {

    @GetMapping("/feature1/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok(
                Map.of(
                        "message", "FE ↔ BE 연결 성공!",
                        "feature", "Feature1",
                        "next", "이제 실제 추천 API로 교체하면 됨"
                )
        );
    }
}