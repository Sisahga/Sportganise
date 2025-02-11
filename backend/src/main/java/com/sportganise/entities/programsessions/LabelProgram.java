package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Entity Model for LabelProgram table. */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "label_program")
public class LabelProgram {

  @EmbeddedId private LabelProgramCompositeKey labelProgramCompositeKey;

  @Column(name = "type")
  private LabelProgramType labelProgramType;
}
