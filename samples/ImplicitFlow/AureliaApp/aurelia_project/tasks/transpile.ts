import * as gulp from "gulp";
import * as changedInPlace from "gulp-changed-in-place";
import * as plumber from "gulp-plumber";
import * as sourcemaps from "gulp-sourcemaps";
import * as notify from "gulp-notify";
import * as rename from "gulp-rename";
import * as ts from "gulp-typescript";
import * as project from "../aurelia.json";
import { CLIOptions, build } from "aurelia-cli";
import * as eventStream from "event-stream";
import * as merge from "merge2";

function configureEnvironment() {
  let env = CLIOptions.getEnvironment();

  return gulp.src(`aurelia_project/environments/${env}.ts`)
    .pipe(changedInPlace({ firstPass: true }))
    .pipe(rename("environment.ts"))
    .pipe(gulp.dest(project.paths.root));
}

let tsProject = tsProject || null;

function buildTypeScript() {

  build.src(project);

  if (!tsProject) {
    tsProject = ts.createProject("tsconfig.json", {
      "typescript": require("typescript"),
    });
  }

  let dts = gulp.src(project.transpiler.dtsSource);

  let src = gulp.src(project.transpiler.source)
    .pipe(changedInPlace({ firstPass: true }));

  let tsResult = eventStream.merge(dts, src)
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return merge([
    tsResult.dts.pipe(gulp.dest(project.platform.output)),
    tsResult.pipe(build.bundle())]);
}

export default gulp.series(
  configureEnvironment,
  buildTypeScript
);
