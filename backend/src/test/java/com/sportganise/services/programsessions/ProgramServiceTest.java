//package com.sportganise.services.programsessions;
//
//import static org.junit.jupiter.api.Assertions.*;
//
//import com.sportganise.dto.programsessions.ProgramDto;
//import com.sportganise.dto.programsessions.ProgramParticipantDto;
//import com.sportganise.entities.Account;
//import com.sportganise.entities.programsessions.Program;
//import com.sportganise.entities.programsessions.ProgramParticipant;
//import com.sportganise.entities.programsessions.ProgramParticipantCompositeKey;
//import com.sportganise.repositories.AccountRepository;
//import com.sportganise.repositories.programsessions.ProgramRepository;
//import com.sportganise.services.auth.AccountService;
//import jakarta.persistence.EntityNotFoundException;
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.Optional;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.Mockito;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//@ExtendWith(MockitoExtension.class)
//public class ProgramServiceTest {
//  @Mock private ProgramRepository programRepository;
//
//  @Mock private AccountService accountService;
//
//  @Mock private AccountRepository accountRepository;
//
//  @InjectMocks private ProgramService programService;
//
//  // Test for getParticipants() method
//  @Test
//  public void testGetParticipants() {
//    // Mock a Program object with the below attributes
//    ProgramParticipant participant1 =
//        ProgramParticipant.builder()
//            .compositeKey(new ProgramParticipantCompositeKey(1, 101))
//            .isConfirmed(true)
//            .confirmedDate(LocalDateTime.now())
//            .build();
//
//    ProgramParticipant participant2 =
//        ProgramParticipant.builder()
//            .compositeKey(new ProgramParticipantCompositeKey(1, 102))
//            .isConfirmed(false)
//            .confirmedDate(LocalDateTime.now().minusDays(1))
//            .build();
//
//    List<ProgramParticipant> mockParticipants = List.of(participant1, participant2);
//
//    // Mock account objects with the below attributes
//    Account account1 =
//        Account.builder()
//            .accountId(101)
//            .type("Player")
//            .firstName("John")
//            .lastName("Doe")
//            .email("john.doe@example.com")
//            .address("123 Main St")
//            .phone("555-555-5555")
//            .build();
//
//    Account account2 =
//        Account.builder()
//            .accountId(102)
//            .type("Coach")
//            .firstName("Jane")
//            .lastName("Smith")
//            .email("jane.smith@example.com")
//            .address("456 Random St")
//            .phone("222-222-2222")
//            .build();
//
//    // Mock the repository and service behavior with mockParticipants, account1 and
//    // account2
//    Mockito.when(programRepository.findParticipantsByProgramId(1)).thenReturn(mockParticipants);
//    Mockito.when(accountService.getAccount(101)).thenReturn(Optional.of(account1));
//    Mockito.when(accountService.getAccount(102)).thenReturn(Optional.of(account2));
//
//    // Call the getParticipants method with programId = 1 to retrieve the list of
//    // participantDtos
//    List<ProgramParticipantDto> participantDtos = programService.getParticipants(1);
//
//    // Verify that participantDtos is not empty/null
//    assertNotNull(participantDtos);
//
//    // Verify that there are correctly 2 participants in participantDtos
//    assertEquals(2, participantDtos.size());
//
//    // Verify that participant1 is correctly retrieved along with its attributes
//    ProgramParticipantDto participantDto1 = participantDtos.getFirst();
//    assertEquals(1, participantDto1.getProgramId());
//    assertEquals(101, participantDto1.getAccountId());
//    assertTrue(participantDto1.isConfirmed());
//    assertEquals(participant1.getConfirmedDate(), participantDto1.getConfirmedDate());
//
//    // Verify that participant2 is correctly retrieved along with the correct
//    // attributes
//    ProgramParticipantDto participantDto2 = participantDtos.get(1);
//    assertEquals(1, participantDto2.getProgramId());
//    assertEquals(102, participantDto2.getAccountId());
//    assertFalse(participantDto2.isConfirmed());
//    assertEquals(participant2.getConfirmedDate(), participantDto2.getConfirmedDate());
//  }
//
//  // Test for getProgramDetails() method
//  @Test
//  public void testGetProgramDetails() {
//    // Mock a Program object with the below attributes
//    Program mockProgram =
//        Program.builder()
//            .programId(1)
//            .programType("Training")
//            .title("Training Program")
//            .description("This is a training program.")
//            .capacity(10)
//            .occurrenceDate(LocalDateTime.of(2025, 5, 15, 10, 0))
//            .durationMins(120)
//            .isRecurring(false)
//            .expiryDate(LocalDateTime.of(2025, 5, 16, 0, 0))
//            .frequency("None")
//            .location("111 Random Ave")
//            .visibility("public")
//            .attachment(List.of("/banner.pdf"))
//            .build();
//
//    // Mock the repository behavior of findProgramById with mockProgram
//    Mockito.when(programRepository.findProgramById(1)).thenReturn(mockProgram);
//
//    // Call the getProgramDetails method with programId = 1 to retrieve the
//    // programDto
//    ProgramDto programDto = programService.getProgramDetails(1);
//
//    // Verify that the returned ProgramDto is not empty/null
//    assertNotNull(programDto);
//
//    // Verify that we have retrieved the correct programDto along with the correct
//    // details/attributes
//    assertEquals(1, programDto.getProgramId());
//    assertEquals("Training", programDto.getProgramType());
//    assertEquals("Training Program", programDto.getTitle());
//    assertEquals("This is a training program.", programDto.getDescription());
//    assertEquals(10, programDto.getCapacity());
//    assertEquals(LocalDateTime.of(2025, 5, 15, 10, 0), programDto.getOccurrenceDate());
//    assertEquals(120, programDto.getDurationMins());
//    assertFalse(programDto.isRecurring());
//    assertEquals(LocalDateTime.of(2025, 5, 16, 0, 0), programDto.getExpiryDate());
//    assertEquals("None", programDto.getFrequency());
//    assertEquals("111 Random Ave", programDto.getLocation());
//    assertEquals("public", programDto.getVisibility());
//    assertEquals("/banner.pdf", programDto.getAttachment().get(0));
//  }
//
//  @Test
//  void testModifyProgram_ProgramNotFound() {
//    // Arrange an empty program. i.e. a program that does not exist in the database
//    ProgramDto programDtoToModify = new ProgramDto();
//    programDtoToModify.setProgramId(1);
//
//    Mockito.when(programRepository.findById(1)).thenReturn(Optional.empty());
//
//    // Act & Assert
//    EntityNotFoundException exception =
//        assertThrows(
//            EntityNotFoundException.class,
//            () ->
//                programService.modifyProgram(
//                    programDtoToModify,
//                    "Updated Title",
//                    "Updated Type",
//                    "2024-01-30T10:00:00Z",
//                    "2024-01-30T10:00:00Z",
//                    false,
//                    "private",
//                    "Updated Description",
//                    30,
//                    true,
//                    "10:30",
//                    "12:30",
//                    "Updated Location",
//                    null));
//    assertEquals("Program not found with ID: 1", exception.getMessage());
//  }
//}
