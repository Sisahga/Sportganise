package com.sportganise.entities.programsessions;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
@EqualsAndHashCode
public class LabelProgramCompositeKey {
    @Column(name = "program_id")
    private Integer programId;

    @Column(name = "label_id")
    private Integer labelId;
}
