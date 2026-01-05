const {
    Activity, Intent, Application
} = AndroidFramework;

const {
    Column, Row, TextView, MaterialButton, MaterialInput
} = AndroidLayouts;

import { TaskModel } from "./TaskModel.js";

class MainActivity extends Activity {
    onCreate() {
        super.onCreate();

        // Model
        this.model = new TaskModel();

        this.renderUI();
    }

    renderUI() {
        const container = Column({ gap: 12, padding: 16 });

        // Input row
        const inputRow = Row({ gap: 8 }, [
            MaterialInput({
                id: "taskInput",
                placeholder: "New task…"
            }),
            MaterialButton({
                text: "Add",
                onClick: () => this.addTask()
            })
        ]);

        container.addChild(inputRow);

        // Task list
        this.model.tasks.forEach((task, idx) => {
            const taskRow = Row({ gap: 8, key: idx }, [
                TextView({
                    text: task,
                    textSize: 18
                }),
                MaterialButton({
                    text: "Done",
                    onClick: () => this.completeTask(idx)
                })
            ]);
            container.addChild(taskRow);
        });

        this.setContentView(container);
    }

    addTask() {
        const input = document.querySelector("#taskInput");
        if (input && input.value.trim()) {
            this.model.add(input.value.trim());
            input.value = "";
            this.renderUI(); 
        }
    }

    completeTask(i) {
        this.model.remove(i);
        this.renderUI();
    }
}

Application.setupBackButton();
Application.launch(MainActivity);