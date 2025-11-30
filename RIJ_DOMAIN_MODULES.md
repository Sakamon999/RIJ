# RIJ Core Domain Modules Documentation

## Overview

The RIJ (Reborn In Japan) core domain modules provide a complete, provider-agnostic implementation for wellness profiling, safety checking, and itinerary generation. All modules are designed to work without external paid APIs in MVP mode.

## Module Structure

```
src/lib/rij/
├── types.ts              # TypeScript interfaces and types
├── validators.ts         # Zod schemas for runtime validation
├── safety.ts             # Safety detection and medical disclaimers
├── orchestrator.ts       # Profiling session orchestration
├── itineraryEngine.ts    # Itinerary generation engine
├── providers/
│   ├── index.ts          # Provider exports
│   ├── stt.ts            # Speech-to-text provider
│   └── llm.ts            # LLM provider
└── index.ts              # Main module exports
```

---

## 1. Types Module (`types.ts`)

### Core Types

**WellnessPillar**
```typescript
type WellnessPillar =
  | 'toji'          // Hot springs
  | 'zen'           // Meditation
  | 'shinrinyoku'   // Forest bathing
  | 'shokuyojo'     // Culinary healing
  | 'matsuri'       // Cultural festivals
  | 'movement'      // Physical activity
  | 'rest';         // Relaxation
```

**ProfilingPhase**
```typescript
type ProfilingPhase =
  | 'state'       // Emotional/mental state
  | 'body'        // Physical needs
  | 'social'      // Companionship
  | 'sensory'     // Experience preferences
  | 'constraints' // Budget/timing
  | 'recap'       // Summary
  | 'done';       // Complete
```

**SafetyFlag**
```typescript
type SafetyFlag =
  | 'self_harm_or_imminent_danger'  // Emergency
  | 'medical_request'                // Medical advice sought
  | 'none';                         // No issues
```

### Provider Interfaces

**SpeechToTextProvider**
```typescript
interface SpeechToTextProvider {
  transcribe(
    audio: Buffer,
    mimeType: string,
    locale: Locale
  ): Promise<TranscriptionResult>;
}
```

**LLMProvider**
```typescript
interface LLMProvider {
  nextTurn(input: LLMNextTurnInput): Promise<LLMNextTurnOutput>;
}
```

---

## 2. Validators Module (`validators.ts`)

Comprehensive Zod schemas for runtime validation of all data structures.

### Usage Example
```typescript
import { validateSessionContext, validateItinerary } from '@/lib/rij';

try {
  const validContext = validateSessionContext(contextData);
  // Use validContext safely
} catch (error) {
  // Handle validation error
}
```

### Available Validators
- `validateProfilingTurn(data)`
- `validateSessionContext(data)`
- `validateExtractedData(data)`
- `validateItinerary(data)`
- `validateItineraryGenerationInput(data)`

---

## 3. Safety Module (`safety.ts`)

### Core Function

**detectSafetyFlags(transcript, locale)**
```typescript
const result = detectSafetyFlags(userInput, 'en');

if (result.shouldStop) {
  // Display emergency message
  console.log(result.emergencyMessage);
  // Stop profiling flow
}
```

### Safety Features

**Self-Harm Detection**
- Detects keywords indicating self-harm or suicidal ideation
- Returns emergency resources (international + Japan-specific)
- Immediately stops profiling flow
- Bilingual support (EN/JA)

**Medical Request Detection**
- Identifies requests for medical advice/diagnosis
- Returns appropriate disclaimer
- Redirects to comfort-focused wellness planning
- Does NOT stop flow, but clarifies scope

**Emergency Resources Provided:**
- TELL Lifeline (Japan): 03-5774-0992
- Inochi no Denwa (Japan): 0570-783-556
- Yori soi Hotline (Japan): 0120-279-338
- International Association for Suicide Prevention
- Crisis Text Line (US)
- Samaritans (UK/Ireland)

### Non-Medical Positioning

All messaging emphasizes:
- "Comfort-focused travel planning"
- "Wellness experiences" not "treatment"
- "Relaxation and restoration" not "healing medical conditions"
- Clear disclaimers when medical topics arise

---

## 4. Providers

### Speech-to-Text Provider (`providers/stt.ts`)

**FakeSTTProvider** - MVP deterministic implementation

```typescript
import { createSTTProvider } from '@/lib/rij';

const sttProvider = createSTTProvider();

const result = await sttProvider.transcribe(
  audioBuffer,
  'audio/webm',
  'en'
);

console.log(result.text);       // Transcribed text
console.log(result.confidence); // 0.0 - 1.0
console.log(result.locale);     // 'en' | 'ja'
```

**Behavior:**
- Empty buffer → Returns placeholder text
- Non-empty buffer → Returns sample wellness-focused text
- No external API calls
- Always returns high confidence (0.95-1.0)
- Suitable for development and testing

**Future Replacement:**
To integrate real STT (e.g., Whisper API):
```typescript
class WhisperSTTProvider implements SpeechToTextProvider {
  async transcribe(audio, mimeType, locale) {
    // Call Whisper API
    // Return TranscriptionResult
  }
}
```

### LLM Provider (`providers/llm.ts`)

**RuleBasedLLMProvider** - MVP deterministic implementation

```typescript
import { createLLMProvider } from '@/lib/rij';

const llmProvider = createLLMProvider();

const output = await llmProvider.nextTurn({
  phase: 'state',
  transcript: 'I want to reduce stress',
  sessionContext,
  locale: 'en',
});

console.log(output.response);                // Next question
console.log(output.nextPhase);               // Next profiling phase
console.log(output.extractedData);           // Parsed information
console.log(output.shouldProceedToItinerary); // Ready for itinerary?
```

**Features:**
- **Deterministic:** Same input always produces same output
- **Phase-based:** Asks specific questions per phase
- **Keyword extraction:** Detects wellness goals, pillars, preferences
- **Safety integrated:** Checks for safety flags before responding
- **Bilingual:** Full EN/JA support
- **No API calls:** Pure rule-based logic

**Extraction Capabilities:**
- Emotional state (stressed, tired, peaceful, etc.)
- Stress level (1-10 scale)
- Wellness pillars (hot springs, meditation, nature, etc.)
- Activity intensity preferences (low/medium/high)
- Companion count
- Budget range
- Dietary restrictions
- Health conditions

**Phase Questions:**
- **state:** "How have you been feeling lately?"
- **body:** "Tell me about your physical needs..."
- **social:** "Will you be traveling alone...?"
- **sensory:** "What kinds of experiences resonate...?"
- **constraints:** "Any time or budget considerations...?"
- **recap:** "Let me summarize..."
- **done:** "Ready to create your itinerary"

**Future Replacement:**
To integrate GPT-4 or Claude:
```typescript
class OpenAILLMProvider implements LLMProvider {
  async nextTurn(input) {
    // Call OpenAI API with structured prompts
    // Parse response into LLMNextTurnOutput format
  }
}
```

---

## 5. Orchestrator Module (`orchestrator.ts`)

The orchestrator manages the entire profiling conversation flow.

### Creating an Orchestrator

```typescript
import { createOrchestrator } from '@/lib/rij';

const orchestrator = createOrchestrator({
  llmProvider: customLLMProvider,  // Optional
  sttProvider: customSTTProvider,  // Optional
});
```

### Initializing a Session

```typescript
const session = orchestrator.initializeSession(userId, 'en');

// Returns SessionContext with initial greeting
console.log(session.turns[0].content);
// "Hello! I'm here to help you plan a wellness journey..."
```

### Processing User Input

```typescript
const result = await orchestrator.processTurn({
  sessionContext: currentSession,
  userInput: 'I want to reduce stress and sleep better',
  inputMode: 'text',
});

// Updated session with new turns
const updatedSession = result.updatedContext;

// Assistant's response
console.log(result.assistantResponse);

// Check if should stop (safety flag)
if (result.shouldStop) {
  // Display emergency message, end session
}

// Check if ready for itinerary
if (result.readyForItinerary) {
  // Generate itinerary from updatedSession.extractedData
}
```

### Utility Methods

```typescript
// Get progress percentage
const progress = orchestrator.getProgress(session.phase);
console.log(`${progress}% complete`);

// Check if complete
if (orchestrator.isComplete(session.phase)) {
  // Ready for itinerary generation
}

// Get profile summary
const summary = orchestrator.getProfileSummary(
  session.extractedData,
  'en'
);
console.log(summary);
// "Emotional state: stressed
//  Preferred experiences: toji, zen
//  Intensity: low
//  Companions: 2"
```

### Flow Control

The orchestrator automatically:
1. Runs safety checks on every input
2. Extracts data from user responses
3. Merges new data with existing session data
4. Generates appropriate next question
5. Advances through phases deterministically
6. Stops on safety flags
7. Signals when ready for itinerary

**Phase Progression:**
```
state → body → social → sensory → constraints → recap → done
```

---

## 6. Itinerary Engine Module (`itineraryEngine.ts`)

Generates personalized 3-act itineraries based on profiling data.

### Creating an Engine

```typescript
import { createItineraryEngine } from '@/lib/rij';

const engine = createItineraryEngine({
  defaultDays: 3,  // Default if not specified
});
```

### Generating an Itinerary

```typescript
const itinerary = engine.generate({
  profileData: session.extractedData,
  locale: 'en',
  targetDays: 3,  // Optional, uses defaultDays if omitted
});

console.log(itinerary.title);
// "3-Day Wellness Journey"

console.log(itinerary.description);
// "A personalized wellness itinerary focusing on Hot Springs,
//  Zen & Meditation, Rest & Relaxation..."

console.log(itinerary.days.length);
// 3

console.log(itinerary.days[0].theme);
// "Arrival & Grounding - Hot Springs"
```

### Itinerary Structure

**Overall Itinerary:**
- Unique UUID
- Title and description
- 3-act narrative structure
- Pillar weights (based on user preferences)
- Intensity curve (starts gentle, peaks, then gentle again)

**Each Day:**
- Day number
- Theme (e.g., "Arrival & Grounding")
- Narrative description
- 3 blocks (morning, afternoon, evening)

**Each Block:**
- Unique UUID (stable for logging)
- Title and description
- Wellness pillar
- Time slot
- Duration
- Intensity level
- **Plan B** alternative
- Notes (generic, no specific locations)

### Features

**Pillar Weighting:**
- Boosts preferred pillars from profiling
- Zeroes out avoided pillars
- Increases zen/rest for stressed users
- Normalizes to sum to 1.0

**Intensity Curve:**
- Day 1: Gentle (0.3-0.4)
- Day 2: Moderate (0.5)
- Day 3: Gentle again (0.2-0.3)
- Supports rest and integration

**3-Act Structure:**
```
Act 1: Arrival & Grounding
  - Gentle introduction
  - Focus on settling in
  - Comfort prioritized

Act 2: Deepening Connection
  - Main experiences
  - Moderate intensity
  - Building on Day 1

Act 3: Integration & Reflection
  - Gentle closing
  - Reflection time
  - Preparation for return
```

**Plan B Options:**
Every block includes a backup plan:
- Alternative activities
- Flexibility for weather/mood
- Maintains comfort focus

**Generic Content:**
- No specific locations (e.g., "peaceful temple" not "Kinkaku-ji")
- No specific practitioners
- No booking links
- Note indicates details provided upon booking

### Utility Methods

```typescript
// Get specific block by ID
const block = engine.getBlockById(itinerary, blockId);

// Get all blocks for a day
const day2Blocks = engine.getDayBlocks(itinerary, 2);
```

---

## Complete Workflow Example

### 1. Initialize Session

```typescript
import { createOrchestrator, createItineraryEngine } from '@/lib/rij';

const orchestrator = createOrchestrator();
const engine = createItineraryEngine();

// Start new session
let session = orchestrator.initializeSession(userId, 'en');

// Show initial greeting to user
displayMessage(session.turns[0].content);
```

### 2. Collect User Input

```typescript
async function handleUserInput(userText: string) {
  const result = await orchestrator.processTurn({
    sessionContext: session,
    userInput: userText,
    inputMode: 'text',
  });

  // Update session
  session = result.updatedContext;

  // Display assistant response
  displayMessage(result.assistantResponse);

  // Check safety
  if (result.shouldStop) {
    endSession();
    return;
  }

  // Check completion
  if (result.readyForItinerary) {
    generateItinerary();
  }
}
```

### 3. Generate Itinerary

```typescript
function generateItinerary() {
  const itinerary = engine.generate({
    profileData: session.extractedData,
    locale: session.locale,
    targetDays: 3,
  });

  // Save to database
  await saveItinerary(session.userId, itinerary);

  // Display to user
  displayItinerary(itinerary);
}
```

### 4. Track Progress During Trip

```typescript
// User is on Day 2, Block 1
const currentBlock = engine.getBlockById(
  itinerary,
  tripSession.currentBlockId
);

// Log check-in
await logCheckIn({
  userId,
  tripSessionId,
  blockId: currentBlock.id,
  moodRating: 4,
  notes: 'Feeling refreshed after meditation',
});
```

---

## Integration with Database

### Storing Profiling Session

```typescript
// Create session in DB
const { data: dbSession } = await supabase
  .from('rij_profiling_sessions')
  .insert({
    user_id: userId,
    status: 'active',
    metadata: { locale: session.locale },
  })
  .select()
  .single();

// Store turns
for (const turn of session.turns) {
  await supabase.from('rij_profiling_turns').insert({
    session_id: dbSession.id,
    user_id: userId,
    turn_number: turn.turnNumber,
    role: turn.role,
    content: turn.content,
    input_mode: turn.inputMode,
  });
}
```

### Storing User Profile

```typescript
await supabase.from('rij_user_profiles').insert({
  user_id: userId,
  session_id: dbSession.id,
  wellness_goals: extractedData.emotionalState,
  preferred_pillars: extractedData.preferredPillars,
  health_conditions: extractedData.healthConditions,
  dietary_restrictions: extractedData.dietaryRestrictions,
  mobility_level: extractedData.mobilityLevel,
  companion_count: extractedData.companionCount,
  budget_range: extractedData.budgetRange,
  intensity: extractedData.intensity,
  profile_data: extractedData,
});
```

### Storing Itinerary

```typescript
// Create itinerary
const { data: dbItinerary } = await supabase
  .from('rij_itineraries')
  .insert({
    user_id: userId,
    profile_id: profileId,
    title: itinerary.title,
    description: itinerary.description,
    status: 'proposed',
    total_days: itinerary.totalDays,
    metadata: {
      pillar_weights: itinerary.pillarWeights,
      intensity_curve: itinerary.intensityCurve,
    },
  })
  .select()
  .single();

// Store blocks
for (const day of itinerary.days) {
  for (const block of day.blocks) {
    await supabase.from('rij_itinerary_blocks').insert({
      itinerary_id: dbItinerary.id,
      day_number: block.dayNumber,
      sequence_order: block.sequenceOrder,
      title: block.title,
      description: block.description,
      pillar: block.pillar,
      time_slot: block.timeSlot,
      duration_minutes: block.durationMinutes,
      notes: block.notes,
      metadata: {
        intensity: block.intensity,
        plan_b: block.planB,
      },
    });
  }
}
```

---

## Testing

### Safety Module Tests

```typescript
import { detectSafetyFlags } from '@/lib/rij';

// Test self-harm detection
const result1 = detectSafetyFlags('I want to hurt myself', 'en');
expect(result1.flags).toContain('self_harm_or_imminent_danger');
expect(result1.shouldStop).toBe(true);
expect(result1.emergencyMessage).toBeDefined();

// Test medical request
const result2 = detectSafetyFlags('Can you diagnose my condition?', 'en');
expect(result2.flags).toContain('medical_request');
expect(result2.shouldStop).toBe(false);

// Test clean input
const result3 = detectSafetyFlags('I want to relax', 'en');
expect(result3.flags).toContain('none');
expect(result3.shouldStop).toBe(false);
```

### Orchestrator Tests

```typescript
import { createOrchestrator } from '@/lib/rij';

const orchestrator = createOrchestrator();

// Test session initialization
const session = orchestrator.initializeSession('user-123', 'en');
expect(session.phase).toBe('state');
expect(session.turns.length).toBe(1);
expect(session.turns[0].role).toBe('assistant');

// Test turn processing
const result = await orchestrator.processTurn({
  sessionContext: session,
  userInput: 'I feel stressed',
  inputMode: 'text',
});

expect(result.updatedContext.turns.length).toBeGreaterThan(1);
expect(result.updatedContext.extractedData.emotionalState).toBeDefined();
```

### Itinerary Engine Tests

```typescript
import { createItineraryEngine } from '@/lib/rij';

const engine = createItineraryEngine();

// Test generation
const itinerary = engine.generate({
  profileData: {
    preferredPillars: ['toji', 'zen'],
    intensity: 'low',
    companionCount: 2,
  },
  locale: 'en',
  targetDays: 3,
});

expect(itinerary.days.length).toBe(3);
expect(itinerary.days[0].blocks.length).toBe(3);
expect(itinerary.pillarWeights.toji).toBeGreaterThan(0);
expect(itinerary.pillarWeights.zen).toBeGreaterThan(0);

// Test block retrieval
const blockId = itinerary.days[0].blocks[0].id;
const block = engine.getBlockById(itinerary, blockId);
expect(block).toBeDefined();
expect(block?.id).toBe(blockId);
```

---

## Provider Replacement Guide

### Replacing FakeSTTProvider

1. Create new provider implementing `SpeechToTextProvider`
2. Integrate with external API (Whisper, Google Speech, etc.)
3. Pass to orchestrator:

```typescript
import { WhisperSTTProvider } from './providers/whisper-stt';

const sttProvider = new WhisperSTTProvider({
  apiKey: process.env.OPENAI_API_KEY,
});

const orchestrator = createOrchestrator({ sttProvider });
```

### Replacing RuleBasedLLMProvider

1. Create new provider implementing `LLMProvider`
2. Integrate with LLM API (OpenAI, Anthropic, etc.)
3. Maintain structured output format:

```typescript
class GPT4LLMProvider implements LLMProvider {
  async nextTurn(input: LLMNextTurnInput): Promise<LLMNextTurnOutput> {
    // 1. Build prompt from input.phase and input.sessionContext
    // 2. Call GPT-4 API
    // 3. Parse response
    // 4. Extract data using function calling or structured output
    // 5. Return LLMNextTurnOutput
  }
}

const llmProvider = new GPT4LLMProvider({
  apiKey: process.env.OPENAI_API_KEY,
});

const orchestrator = createOrchestrator({ llmProvider });
```

---

## Design Principles

1. **Provider Agnostic:** Interfaces separate from implementation
2. **Deterministic MVP:** No external dependencies for initial deployment
3. **Safety First:** Always check for self-harm and medical requests
4. **Non-Medical:** Comfort-focused wellness, never diagnosis/treatment
5. **Bilingual:** Full EN/JA support throughout
6. **Stable IDs:** Block IDs persist for trip logging
7. **Flexibility:** Plan B options for every activity
8. **Progressive:** Easy to swap providers as product matures

---

## File Sizes

- `types.ts`: ~4 KB
- `validators.ts`: ~4 KB
- `safety.ts`: ~5 KB
- `orchestrator.ts`: ~6 KB
- `itineraryEngine.ts`: ~14 KB
- `providers/stt.ts`: ~1 KB
- `providers/llm.ts`: ~8 KB

**Total:** ~42 KB of domain logic

---

## Dependencies

- **Runtime:** `zod` (validation only)
- **No external APIs** required for MVP
- **No paid services** required for MVP
- Compatible with Supabase database schema

---

## Next Steps

1. **Build UI:** Create profiling conversation interface
2. **Storage:** Integrate with Supabase tables
3. **Trip Tracking:** Add check-in features using block IDs
4. **Enhance Providers:** Swap in real STT/LLM when ready
5. **Localization:** Expand beyond EN/JA if needed
6. **Analytics:** Log events for profiling effectiveness
