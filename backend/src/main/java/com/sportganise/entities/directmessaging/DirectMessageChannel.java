package com.sportganise.entities.directmessaging;

import jakarta.persistence.Entity;
import jakarta.persistence.GenerationType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "channel")
public class DirectMessageChannel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer channel_id;
    private String name;
}
