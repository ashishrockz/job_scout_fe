import { useState, useCallback } from "react";
import {
  updateCopilot,
  deleteCopilot,
  triggerCopilot,
  cancelCopilot,
} from "@/lib/copilot.service";
import {
  UpdateCopilotRequest,
  Copilot,
  TriggerCopilotResult,
  CancelCopilotResult,
} from "@/types/copilot";

interface MutationState<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
}

interface UseCopilotMutationsResult {
  // Update copilot
  updateState: MutationState<Copilot>;
  update: (copilotId: string, data: UpdateCopilotRequest) => Promise<boolean>;

  // Delete copilot
  deleteState: MutationState<null>;
  remove: (copilotId: string) => Promise<boolean>;

  // Trigger copilot
  triggerState: MutationState<TriggerCopilotResult>;
  trigger: (copilotId: string) => Promise<boolean>;

  // Cancel copilot
  cancelState: MutationState<CancelCopilotResult>;
  cancel: (copilotId: string) => Promise<boolean>;
}

export const useCopilotMutations = (): UseCopilotMutationsResult => {
  // Update state
  const [updateState, setUpdateState] = useState<MutationState<Copilot>>({
    loading: false,
    error: null,
    data: null,
  });

  // Delete state
  const [deleteState, setDeleteState] = useState<MutationState<null>>({
    loading: false,
    error: null,
    data: null,
  });

  // Trigger state
  const [triggerState, setTriggerState] = useState<
    MutationState<TriggerCopilotResult>
  >({
    loading: false,
    error: null,
    data: null,
  });

  // Cancel state
  const [cancelState, setCancelState] = useState<
    MutationState<CancelCopilotResult>
  >({
    loading: false,
    error: null,
    data: null,
  });

  /**
   * Update a copilot
   */
  const update = useCallback(
    async (copilotId: string, data: UpdateCopilotRequest): Promise<boolean> => {
      setUpdateState({ loading: true, error: null, data: null });

      const response = await updateCopilot(copilotId, data);

      if (response.success) {
        setUpdateState({
          loading: false,
          error: null,
          data: response.data || null,
        });
        return true;
      } else {
        setUpdateState({
          loading: false,
          error: response.message || "Failed to update copilot",
          data: null,
        });
        return false;
      }
    },
    []
  );

  /**
   * Delete a copilot
   */
  const remove = useCallback(async (copilotId: string): Promise<boolean> => {
    setDeleteState({ loading: true, error: null, data: null });

    const response = await deleteCopilot(copilotId);

    if (response.success) {
      setDeleteState({ loading: false, error: null, data: null });
      return true;
    } else {
      setDeleteState({
        loading: false,
        error: response.message || "Failed to delete copilot",
        data: null,
      });
      return false;
    }
  }, []);

  /**
   * Trigger a copilot to run
   */
  const trigger = useCallback(async (copilotId: string): Promise<boolean> => {
    setTriggerState({ loading: true, error: null, data: null });

    const response = await triggerCopilot(copilotId);

    if (response.success) {
      setTriggerState({
        loading: false,
        error: null,
        data: response.data || null,
      });
      return true;
    } else {
      setTriggerState({
        loading: false,
        error: response.message || "Failed to trigger copilot",
        data: null,
      });
      return false;
    }
  }, []);

  /**
   * Cancel a running copilot
   */
  const cancel = useCallback(async (copilotId: string): Promise<boolean> => {
    setCancelState({ loading: true, error: null, data: null });

    const response = await cancelCopilot(copilotId);

    if (response.success) {
      setCancelState({
        loading: false,
        error: null,
        data: response.data || null,
      });
      return true;
    } else {
      setCancelState({
        loading: false,
        error: response.message || "Failed to cancel copilot",
        data: null,
      });
      return false;
    }
  }, []);

  return {
    updateState,
    update,
    deleteState,
    remove,
    triggerState,
    trigger,
    cancelState,
    cancel,
  };
};
