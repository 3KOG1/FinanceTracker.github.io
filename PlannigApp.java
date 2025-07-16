import javafx.application.Application;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.geometry.Insets;
import javafx.scene.Scene;
import javafx.scene.control.*;
import javafx.scene.layout.BorderPane;
import javafx.scene.layout.HBox;
import javafx.scene.layout.Priority;
import javafx.scene.layout.VBox;
import javafx.scene.paint.Color;
import javafx.stage.Stage;

public class PlanningApp extends Application {

    // A simple class to represent a task
    public static class Task {
        private String description;
        private boolean completed;

        public Task(String description) {
            this.description = description;
            this.completed = false;
        }

        public String getDescription() {
            return description;
        }

        public boolean isCompleted() {
            return completed;
        }

        public void setCompleted(boolean completed) {
            this.completed = completed;
        }
    }

    @Override
    public void start(Stage primaryStage) {
        primaryStage.setTitle("Planning App");

        // Main layout
        BorderPane root = new BorderPane();
        root.getStyleClass().add("root");

        // --- LEFT PANE: Task List ---
        VBox leftPane = new VBox(10);
        leftPane.setPadding(new Insets(15));

        Label tasksHeader = new Label("My Tasks");
        tasksHeader.getStyleClass().add("header-label");

        // Data for the list view
        ObservableList<Task> tasks = FXCollections.observableArrayList(
                new Task("Finalize project report"),
                new Task("Schedule team meeting"),
                new Task("Buy groceries")
        );

        ListView<Task> taskListView = new ListView<>(tasks);
        taskListView.getStyleClass().add("task-list-view");

        // Custom cell factory to display tasks with a checkbox
        taskListView.setCellFactory(param -> new ListCell<>() {
            private final CheckBox checkBox = new CheckBox();
            private final Label label = new Label();
            private final HBox hbox = new HBox(10, checkBox, label);

            {
                // When the checkbox state changes, update the task's completed status
                checkBox.setOnAction(event -> {
                    if (getItem() != null) {
                        getItem().setCompleted(checkBox.isSelected());
                        updateStyle();
                    }
                });
            }

            @Override
            protected void updateItem(Task item, boolean empty) {
                super.updateItem(item, empty);
                if (empty || item == null) {
                    setText(null);
                    setGraphic(null);
                } else {
                    label.setText(item.getDescription());
                    checkBox.setSelected(item.isCompleted());
                    setGraphic(hbox);
                    updateStyle();
                }
            }
            
            private void updateStyle() {
                if (getItem() != null && getItem().isCompleted()) {
                    label.getStyleClass().add("completed-task");
                } else {
                    label.getStyleClass().remove("completed-task");
                }
            }
        });

        // --- Input for adding new tasks ---
        HBox addTaskBox = new HBox(10);
        addTaskBox.setPadding(new Insets(10, 0, 0, 0));
        TextField newTaskField = new TextField();
        newTaskField.setPromptText("Add a new task...");
        newTaskField.getStyleClass().add("new-task-field");
        HBox.setHgrow(newTaskField, Priority.ALWAYS);

        Button addButton = new Button("Add");
        addButton.getStyleClass().add("add-button");
        addButton.setDefaultButton(true);

        addButton.setOnAction(e -> {
            String text = newTaskField.getText();
            if (text != null && !text.trim().isEmpty()) {
                tasks.add(new Task(text.trim()));
                newTaskField.clear();
            }
        });

        addTaskBox.getChildren().addAll(newTaskField, addButton);
        leftPane.getChildren().addAll(tasksHeader, taskListView, addTaskBox);
        root.setLeft(leftPane);

        // --- CENTER PANE: Placeholder for Calendar/Details ---
        VBox centerPane = new VBox();
        centerPane.setPadding(new Insets(15));
        Label calendarHeader = new Label("Details");
        calendarHeader.getStyleClass().add("header-label");
        centerPane.getChildren().add(calendarHeader);
        root.setCenter(centerPane);


        // --- SCENE SETUP ---
        Scene scene = new Scene(root, 900, 650);
        // Load the CSS file
        String css = this.getClass().getResource("styles.css").toExternalForm();
        scene.getStylesheets().add(css);
        
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}

