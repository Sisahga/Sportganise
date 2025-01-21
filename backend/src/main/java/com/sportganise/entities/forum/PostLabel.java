package com.sportganise.entities.forum;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** This class represents the PostLabel entity. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class PostLabel {

  @EmbeddedId private PostLabelCompositeKey postLabelCompositeKey;
}
