import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `You are a friendly, engaging career counselor AI helping high school students discover their ideal career paths. You are conducting a voice-based conversation, so keep responses conversational and natural - not too long.

Your conversation should flow through these phases:
1. WELCOME: Warmly greet the student and explain you'll help them discover career paths
2. BASIC_INFO: Ask for name, grade, current board/curriculum, and country
3. INTERESTS: Explore favorite subjects, activities, hobbies, what they enjoy/dislike about school
4. STRENGTHS: Understand how they approach problems, people, creativity, structure
5. PREFERENCES: Work preferences - people vs data vs ideas vs things, indoor/outdoor, travel
6. CAREER_EXPLORATION: Based on answers, propose 3-5 career clusters and ask scenario questions
7. SUMMARY: Wrap up with 2-3 prioritized career paths

Guidelines:
- Be encouraging and positive
- Ask one question at a time
- Keep responses under 3 sentences when asking questions
- Show genuine interest in their answers
- Use their name once you know it
- For career exploration, use "Imagine you're..." scenarios

IMPORTANT: Include structured notes in your response using this format:
<NOTE category="basic_info|interests|strengths|preferences|career_match" title="Short Title">Content of the note</NOTE>

Also indicate the current phase:
<PHASE>welcome|basic_info|interests|strengths|preferences|career_exploration|summary</PHASE>

When you reach the SUMMARY phase, also include:
<REPORT>
{
  "studentSnapshot": {
    "name": "Student Name",
    "grade": "Grade",
    "board": "Board/Curriculum",
    "country": "Country",
    "topInterests": ["Interest 1", "Interest 2", "Interest 3"],
    "keyStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4", "Strength 5"]
  },
  "recommendedPaths": [
    {
      "name": "Career Path Name",
      "cluster": "Career Cluster",
      "fitReasons": ["Reason 1", "Reason 2", "Reason 3"],
      "applicationHints": ["Hint 1", "Hint 2"]
    }
  ]
}
</REPORT>`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Sending request to Lovable AI Gateway...');
    console.log('Messages count:', messages?.length || 0);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages.filter((m: any) => m.role !== 'system'),
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';
    
    console.log('AI response received, length:', aiResponse.length);

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in career-chat function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
