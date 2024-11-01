package com.sportsganize.helloworld;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Defines the routes. */
@RestController
public class HelloController {

  @GetMapping("/")
  public String index() {
    return "Hello, world!";
  }
}
