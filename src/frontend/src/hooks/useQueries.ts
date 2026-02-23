import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StudySession } from '@/backend';

export function useProgressData() {
  const { actor, isFetching } = useActor();

  const sessionsQuery = useQuery<StudySession[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSessions();
    },
    enabled: !!actor && !isFetching,
  });

  const completionRateQuery = useQuery<bigint>({
    queryKey: ['completionRate'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.calculateCompletionRate();
    },
    enabled: !!actor && !isFetching,
  });

  return {
    sessionsQuery,
    completionRateQuery,
  };
}

export function useStudyPlanMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const addSessionMutation = useMutation({
    mutationFn: async ({ subject, startTime, endTime }: { subject: string; startTime: bigint; endTime: bigint }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addSession(subject, startTime, endTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['completionRate'] });
    },
  });

  const completeSessionMutation = useMutation({
    mutationFn: async (subject: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.completeSession(subject);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['completionRate'] });
    },
  });

  return {
    addSessionMutation,
    completeSessionMutation,
  };
}
