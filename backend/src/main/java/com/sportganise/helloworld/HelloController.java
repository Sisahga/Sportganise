package com.sportganise.helloworld;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Defines the routes. */
@RestController
public class HelloController {

  // TODO[246]: configure CORS policy
  @CrossOrigin(origins = "*")
  @GetMapping("/")
  public String index() {
    return "Hello, world!";
  }
}
