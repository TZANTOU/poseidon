<?php
$mysqli = new mysqli("localhost", "root", "", "poseidon_stats");
if ($mysqli->connect_error) {
    die("Σφάλμα σύνδεσης: " . $mysqli->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $date = $_POST['match_date'];
    $opponent = $mysqli->real_escape_string($_POST['opponent']);
    $goals_for = (int)$_POST['goals_for'];
    $goals_against = (int)$_POST['goals_against'];

    $sql = "INSERT INTO matches (match_date, opponent, goals_for, goals_against)
            VALUES ('$date', '$opponent', $goals_for, $goals_against)";

    if ($mysqli->query($sql)) {
        $message = "✅ Η αναμέτρηση καταχωρήθηκε επιτυχώς!";
    } else {
        $message = "❌ Σφάλμα: " . $mysqli->error;
    }
}
?>

<!DOCTYPE html>
<html lang="el">
<head>
    <meta charset="UTF-8">
    <title>Καταχώρηση Αναμέτρησης</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        form { max-width: 500px; }
        input, label { display: block; margin-bottom: 10px; width: 100%; }
    </style>
</head>
<body>
    <h1>Καταχώρηση Αναμέτρησης</h1>

    <?php if (isset($message)) echo "<p><strong>$message</strong></p>"; ?>

    <form method="POST">
        <label>Ημερομηνία Αγώνα:
            <input type="date" name="match_date" required>
        </label>

        <label>Αντίπαλος:
            <input type="text" name="opponent" required>
        </label>

        <label>Γκολ Υπέρ:
            <input type="number" name="goals_for" min="0" required>
        </label>

        <label>Γκολ Κατά:
            <input type="number" name="goals_against" min="0" required>
        </label>

        <input type="submit" value="Καταχώρηση">
    </form>
</body>
</html>
